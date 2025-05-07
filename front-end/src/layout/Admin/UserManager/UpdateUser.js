import {
    FireOutlined,
    LockOutlined,
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
  
  function UpdateUser() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [userData, setUserData] = useState(null);
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
        await axios.put(`http://localhost:3005/api/user/${id}`, newData, {
          withCredentials: true,
        });
        successMessage();
        setTimeout(() => {
          navigate("/admin/users");
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
  
          const storageRef = ref(storage, `dream/${compressedFile.name}`);
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
                const newUserData = {
                  username: values.username,
                  password: values.password,
                  email: values.email,
                  fullname: values.name,
                  role: values.role,
                  avatar: downloadURL,
                };
                handleUpdateById(newUserData);
                setSpinning(false);
              });
            }
          );
        } else {
          const newUserData = {
            username: values.username,
            password: values.password,
            email: values.email,
            fullname: values.name,
            role: values.role,
          };
          await handleUpdateById(newUserData);
          setSpinning(false);
        }
      } catch (error) {
        console.error("Error:", error);
        errorMessage();
        setSpinning(false);
      }
    };
  
    const fetchUserData = async () => {
      try {
        setSpinning(true);
        const response = await axios.get(`http://localhost:3005/api/user/${id}`, {
          withCredentials: true,
        });
        const data = response.data;
        setUserData(data);
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
        console.error("Fetch user failed:", error);
        setSpinning(false);
      }
    };
  
    useEffect(() => {
        fecthUserData();
    },[])
  
    return (
      <Flex className="UpdateUser" vertical gap={20}>
        {contextHolder}
        <Spin spinning={spinning} fullscreen />
        <Breadcrumb
          items={[
            { title: "Admin Dashboard" },
            { title: <Link to="/admin/users">Quản lý người dùng</Link> },
            { title: "Cập nhật" },
            { title: userData?.fullname },
          ]}
        />
        {userData && (
          <Form
            name="update_user"
            style={{ width: 400, margin: "0 auto" }}
            initialValues={{
              name: userData.fullname,
              email: userData.email,
              username: userData.username,
              role: userData.role,
            }}
            onFinish={onFinish}
          >
            <Form.Item name="name">
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
            <Form.Item name="username">
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập"
                allowClear
                size="large"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                allowClear
                size="large"
              />
            </Form.Item>
            <Form.Item name="role">
              <Select
                placeholder="Loại tài khoản"
                size="large"
                options={[
                  { label: "Student", value: "Student" },
                  { label: "Admin", value: "Admin" },
                ]}
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
                Cập nhật người dùng
              </Button>
            </Form.Item>
          </Form>
        )}
      </Flex>
    );
  }
  
  export default UpdateUser;
  
