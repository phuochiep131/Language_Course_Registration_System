import {
    Form,
    Input,
    Button,
    Breadcrumb,
    Flex,
    Spin,
    message,
  } from "antd";
  import axios from "axios";
  import { useEffect, useState } from "react";
  import { Link, useNavigate, useParams } from "react-router-dom";
  
  function UpdateLanguage() {
    const { id } = useParams(); // id là mã ngôn ngữ
    const navigate = useNavigate();
  
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
  
    const successMessage = () => {
      messageApi.open({
        type: "success",
        content: "Cập nhật thành công",
      });
    };
  
    const errorMessage = () => {
      messageApi.open({
        type: "error",
        content: "Cập nhật thất bại",
      });
    };
  
    const fetchLanguage = async () => {
      console.log(id)
      setSpinning(true);
      try {
        const res = await axios.get(`http://localhost:3005/api/language/${id}`, {
          withCredentials: true,
        });
        form.setFieldsValue({
          id: res.data._id, // hoặc 'res.data.id' nếu bạn lưu kiểu đó
          language: res.data.language,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ngôn ngữ:", error);
        messageApi.error("Không thể tải dữ liệu ngôn ngữ");
      } finally {
        setSpinning(false);
      }
    };


  
    const onFinish = async (values) => {
      setSpinning(true);
      try {
        await axios.put(`http://localhost:3005/api/language/${id}`, values, {
          withCredentials: true,
        });
        successMessage();
        setTimeout(() => {
          navigate("/admin/languages");
        }, 1000);
      } catch (error) {
        console.error("Cập nhật thất bại:", error);
        errorMessage();
      } finally {
        setSpinning(false);
      }
    };
  
    useEffect(() => {
      fetchLanguage();
    }, [id]);
  
    return (
      <Flex className="UpdateLanguage" vertical gap={20}>
        {contextHolder}
        <Spin spinning={spinning} fullscreen />
        <Breadcrumb
          items={[
            { title: "Admin Dashboard" },
            { title: <Link to="/admin/languages">Quản lý ngôn ngữ</Link> },
            { title: `Cập nhật ngôn ngữ` },
          ]}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <Form.Item label="Mã ngôn ngữ (ID)" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên ngôn ngữ"
            name="language"
            rules={[{ required: true, message: "Vui lòng nhập tên ngôn ngữ" }]}
          >
            <Input placeholder="Ví dụ: Tiếng Anh" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              disabled={spinning}
            >
              Cập nhật ngôn ngữ
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    );
  }
  
  export default UpdateLanguage;
  