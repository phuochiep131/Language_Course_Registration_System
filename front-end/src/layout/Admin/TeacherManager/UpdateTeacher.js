import { MailOutlined, SmileOutlined} from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Form, Input, Select, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateTeacher() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [spinning, setSpinning] = useState(true);
    const [teacherData, setTeacherData] = useState();
    const [languageOptions, setLanguageOptions] = useState([]);    

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
                messageApi.success("Sửa giảng viên thành công");
                setTimeout(() => {
                    navigate('/admin/teachers');
                }, 1000);
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message
                messageApi.error(errorMsg);
            });
    };

    const onFinish = async (values) => {
        setSpinning(true);
        const newTeacherData = {
            full_name: values.name,
            email: values.email,
            language_id: values.language
        };
        handleUpdateById(newTeacherData);
        setSpinning(false);
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
                    { title: <Link to="/admin/teachers">Quản lý giảng viên</Link> },
                    { title: 'Cập nhật' },
                    { title: teacherData?.fullname },
                ]}
            />
            {
                teacherData &&
                <Form
                    name="update_teacher"
                    layout='vertical'
                    style={{ width: 400, margin: "0 auto" }}
                    initialValues={{
                        teacherid: teacherData.teacherid,
                        name: teacherData.full_name,
                        email: teacherData.email,                        
                    }}
                    onFinish={onFinish}
                >                    
                    <Form.Item
                        name="teacherid"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item 
                    name="name"
                    label="Họ và tên"
                    rules={[
                        { required: true, message: "Vui lòng nhập họ và tên!" },
                        {
                            validator: (_, value) => {
                            if (!value) return Promise.resolve();

                            if (/\d/.test(value)) 
                            {
                                return Promise.reject("Họ và tên không được chứa ký tự số!");
                            }

                            if (/[^a-zA-ZÀ-Ỹà-ỹ\s]/.test(value))
                            {
                                return Promise.reject("Họ và tên không được chứa ký tự đặc biệt!");
                            }

                            return Promise.resolve();
                            }
                        }
                    ]}>
                        <Input prefix={<SmileOutlined />} placeholder="Họ và tên" allowClear size="large" />
                    </Form.Item>
                    <Form.Item 
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" allowClear size="large" />
                    </Form.Item>
                    <Form.Item 
                    name="language"
                    label="Ngôn ngữ giảng dạy"
                    rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ!" }]}
                    >
                        <Select placeholder="Chọn ngôn ngữ">
                            {
                                languageOptions.map(lang => (
                                    <Select.Option key={lang._id} value={lang._id}>
                                        {lang.language}
                                    </Select.Option>
                                ))
                            }
                        </Select>
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
