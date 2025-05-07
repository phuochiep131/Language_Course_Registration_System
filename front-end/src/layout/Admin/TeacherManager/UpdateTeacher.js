import {
    MailOutlined,
    SmileOutlined,
    UserOutlined,
  } from "@ant-design/icons";
  import {
    Breadcrumb,
    Button,
    Flex,
    Form,
    Input,
    Select,
    Spin,
    Upload,
    message,
  } from "antd";
  import { useEffect, useState } from "react";
  import imageCompression from "browser-image-compression";
  import axios from "axios";
  import { storage } from "../../../firebase";
  import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } from "firebase/storage";
  import { Link, useNavigate, useParams } from "react-router-dom";
  
  function UpdateTeacher() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [teacherData, setTeacherData] = useState(null);
    const [checkChangeAvatar, setCheckChangeAvatar] = useState(false);
  
    const successMessage = () => {
      messageApi.open({
        key: "update",
        type: "success",
        content: "Cập nhật thành công",
      });
    };
  
    const errorMessage = () => {
      messageApi.open({
        key: "update",
        type: "error",
        content: "Cập nhật thất bại",
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
  
    const handleUpdateById = async (newData) => {
      try {
        await axios.put(`http://localhost:3005/api/teacher/${id}`, newData, {
          withCredentials: true,
        });
        successMessage();
        setTimeout(() => {
          navigate("/admin/teachers");
        }, 1000);
      } catch (error) {
        console.error("Update failed:", error);
        errorMessage();
      }
    };
  
    const onFinish = async (values) => {
      setSpinning(true);
      try {
        if (fileList[0] && checkChangeAvatar) {
          const file = fileList[0].originFileObj;
          let compressedFile = file;
  
          if (file.size > 1024 * 1024) {
            compressedFile = await imageCompression(file, {
              maxSizeMB: 0.8,
              maxWidthOrHeight: 1024,
              useWebWorker: true,
            });
          }
  
          const storageRef = ref(storage, `teachers/${compressedFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, compressedFile);
  
          uploadTask.on(
            "state_changed",
            () => {},
            (error) => {
              console.error("Upload error:", error);
              errorMessage();
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const newTeacherData = {
                  full_name: values.full_name,
                  email: values.email,
                  gender: values.gender,
                  language: values.language,
                  avatar: downloadURL,
                };
                handleUpdateById(newTeacherData);
                setSpinning(false);
              });
            }
          );
        } else {
          const newTeacherData = {
            full_name: values.full_name,
            email: values.email,
            gender: values.gender,
            language: values.language,
          };
          await handleUpdateById(newTeacherData);
          setSpinning(false);
        }
      } catch (error) {
        console.error("Error:", error);
        errorMessage();
        setSpinning(false);
      }
    };
  
    const fetchTeacherData = async () => {
      try {
        setSpinning(true);
        const response = await axios.get(`http://localhost:3005/api/teacher/${id}`, {
          withCredentials: true,
        });
        const data = response.data;
        setTeacherData(data);
        setFileList([
          {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: data.avatar,
          },
        ]);
        setSpinning(false);
      } catch (error) {
        console.error("Fetch teacher failed:", error);
        setSpinning(false);
      }
    };
  
    useEffect(() => {
      fetchTeacherData();
    }, [id]);
  
    return (
      <Flex className="UpdateTeacher" vertical gap={20}>
        {contextHolder}
        <Spin spinning={spinning} fullscreen />
        <Breadcrumb
          items={[
            { title: "Admin Dashboard" },
            { title: <Link to="/admin/teachers">Quản lý giảng viên</Link> },
            { title: "Cập nhật" },
            { title: teacherData?.full_name },
          ]}
        />
        {teacherData && (
          <Form
            name="update_teacher"
            style={{ width: 400, margin: "0 auto" }}
            initialValues={{
              full_name: teacherData.full_name,
              email: teacherData.email,
              gender: teacherData.gender,
              language: teacherData.language,
            }}
            onFinish={onFinish}
          >
            <Form.Item name="full_name">
              <Input
                prefix={<SmileOutlined />}
                placeholder="Họ và tên"
                allowClear
                size="large"
              />
            </Form.Item>
            <Form.Item name="email">
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                allowClear
                size="large"
              />
            </Form.Item>
            <Form.Item name="gender">
              <Select
                placeholder="Giới tính"
                size="large"
                options={[
                  { label: "Nam", value: "Nam" },
                  { label: "Nữ", value: "Nữ" },
                  { label: "Khác", value: "Khác" },
                ]}
              />
            </Form.Item>
            <Form.Item name="language">
              <Input
                prefix={<UserOutlined />}
                placeholder="Ngôn ngữ giảng dạy"
                allowClear
                size="large"
              />
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                disabled={spinning}
              >
                Cập nhật giảng viên
              </Button>
            </Form.Item>
          </Form>
        )}
      </Flex>
    );
  }
  
  export default UpdateTeacher;
  