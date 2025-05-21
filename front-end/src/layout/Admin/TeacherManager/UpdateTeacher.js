import { LockOutlined, MailOutlined, SmileOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Form, Input, Select, Spin, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateTeacher() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [teacherData, setTeacherData] = useState();
    const [checkChangeAvatar, setCheckChangeAvatar] = useState(false);
    const [languageOptions, setLanguageOptions] = useState([]);

    const successMessage = () => {
        messageApi.open({
            key: 'update',
            type: 'success',
            content: 'Cập nhật thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            key: 'update',
            type: 'error',
            content: 'Cập nhật thất bại',
        });
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setCheckChangeAvatar(true);
    };

    const fetchLanguages = async () => {
        try {
            const res = await axios.get('http://localhost:3005/api/language');
            setLanguageOptions(res.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách ngôn ngữ:", error);
        }
    };

    const fetchTeacherData = async () => {
        setSpinning(true);
        try {
            const res = await axios.get(`http://localhost:3005/api/teacher/${id}`);
            setTeacherData(res.data);
            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data.avatar,
                }
            ]);
        } catch (error) {
            console.error("Lỗi lấy thông tin giáo viên:", error);
        } finally {
            setSpinning(false);
        }
    };

    const handleUpdateById = (newData) => {
        axios.put(`http://localhost:3005/api/teacher/${id}`, newData, {
            withCredentials: true
        })
            .then(() => {
                successMessage();
                setTimeout(() => {
                    navigate('/admin/teachers');
                }, 1000);
            })
            .catch(error => {
                console.error('Lỗi cập nhật giáo viên:', error);
                errorMessage();
            });
    };

    const onFinish = async (values) => {
        setSpinning(true);

        if (fileList[0] && checkChangeAvatar) {
            const file = fileList[0].originFileObj;
            const maxImageSize = 1024;

            try {
                let compressedFile = file;

                if (file.size > maxImageSize) {
                    compressedFile = await imageCompression(file, {
                        maxSizeMB: 0.8,
                        maxWidthOrHeight: maxImageSize,
                        useWebWorker: true,
                    });
                }

                const storageRef = ref(storage, `teachers/${compressedFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, compressedFile);

                uploadTask.on("state_changed", null, (error) => {
                    console.error(error);
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const newTeacherData = {
                            full_name: values.name,
                            email: values.email,
                            // username: values.username,
                            // password: values.password,
                            language_id: values.language
                            // avatar: downloadURL
                        };
                        handleUpdateById(newTeacherData);
                        setSpinning(false);
                    });
                });
            } catch (error) {
                console.error('Lỗi nén ảnh:', error);
                setSpinning(false);
            }
        } else {
            const newTeacherData = {
                full_name: values.name,
                email: values.email,
                // username: values.username,
                // password: values.password,
                language_id: values.language
                // avatar: downloadURL
            };
            handleUpdateById(newTeacherData);
            setSpinning(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
        fetchTeacherData();
    }, []);

    return (
        <Flex className="UpdateTeacher" vertical gap={20}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    { title: 'Admin Dashboard' },
                    { title: <Link to="/admin/teachers">Quản lý giáo viên</Link> },
                    { title: 'Cập nhật' },
                    { title: teacherData?.fullname },
                ]}
            />
            {
                teacherData &&
                <Form
                    name="update_teacher"
                    style={{ width: 400, margin: "0 auto" }}
                    initialValues={{
                        name: teacherData.full_name,
                        email: teacherData.email,
                        // username: teacherData.username,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="name">
                        <Input prefix={<SmileOutlined />} placeholder="Họ và tên" allowClear size="large" />
                    </Form.Item>
                    <Form.Item name="email">
                        <Input prefix={<MailOutlined />} placeholder="Email" allowClear size="large" />
                    </Form.Item>
                    {/* <Form.Item name="username">
                        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" allowClear size="large" />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" allowClear size="large" />
                    </Form.Item> */}
                    <Form.Item name="language">
                        <Select
                            placeholder="Ngôn ngữ giảng dạy"
                            size="large"
                            suffixIcon={<BookOutlined />}
                        >
                            {
                                languageOptions.map(lang => (
                                    <Select.Option key={lang._id} value={lang._id}>
                                        {lang.language}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="avatar">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            beforeUpload={() => false}
                            onPreview={onPreview}
                            maxCount={1}
                        >
                            Upload
                        </Upload>
                    </Form.Item>
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                            Cập nhật thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            }
        </Flex>
    );
}

export default UpdateTeacher;
