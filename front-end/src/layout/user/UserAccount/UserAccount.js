// src/components/layout/user/UserAccount/UserAccount.js
import {
  LockOutlined,
  MailOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams } from "react-router-dom";
import { Typography } from "antd";
const { Title } = Typography;

function UserAcc() {
  const { id } = useParams();

  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [userData, setUserData] = useState();
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

  const handleUpdateById = (newData) => {
    axios
      .put(`http://localhost:3005/api/user/${id}`, newData, {
        withCredentials: true,
      })
      .then(() => {
        successMessage();
        setSpinning(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        errorMessage();
        setSpinning(false);
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

        const storageRef = ref(storage, `dream/${compressedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const newUserData = {
                username: values.username,
                password: values.password,
                email: values.email,
                fullname: values.name,
                avatar: downloadURL,
              };
              handleUpdateById(newUserData);
            });
          }
        );
      } catch (error) {
        console.error("Image Compression Error:", error);
        errorMessage();
        setSpinning(false);
      }
    } else {
      const newUserData = {
        username: values.username,
        password: values.password,
        email: values.email,
        fullname: values.name,
      };
      handleUpdateById(newUserData);
    }
  };

  const fetchUserData = async () => {
    setSpinning(true);
    axios
      .get(`http://localhost:3005/api/user/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const user = response.data;
        setUserData(user);
        setFileList([
          {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: user.avatar,
          },
        ]);
        setSpinning(false);
      })
      .catch((error) => {
        console.log(error);
        setSpinning(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Flex className="UpdateUser" vertical gap={20}>
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      {/* <Breadcrumb
                items={[
                    {
                        title: <Link to="/">Trang chủ</Link>,
                    },
                    {
                        title: 'Tài khoản của tôi',
                    },
                ]}
            /> */}
      {userData && (
        <Form
          name="update_user"
          style={{ width: "400px", margin: "0 auto" }}
          initialValues={{
            name: userData.fullname,
            email: userData.email,
            username: userData.username,
          }}
          onFinish={onFinish}
        >
          <Title
            level={3}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Thông tin tài khoản
          </Title>
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
              placeholder="Mật khẩu mới"
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
              Tải ảnh
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
            >
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      )}
    </Flex>
  );
}

export default UserAcc;
