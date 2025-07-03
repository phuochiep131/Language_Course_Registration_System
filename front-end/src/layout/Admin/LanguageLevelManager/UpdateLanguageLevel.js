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
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
  
    const fetchLanguage = async () => {      
      setSpinning(true);
      try {
        const res = await axios.get(`http://localhost:3005/api/languagelevel/${id}`, {
          withCredentials: true,
        });
        form.setFieldsValue({
          id: res.data._id,
          language_level: res.data.language_level,
          language_levelid: res.data.language_levelid,
        });
      } catch (error) {
        //console.error("Lỗi khi lấy dữ liệu trình độ:", error);
        messageApi.error("Không thể tải dữ liệu trình độ");
      } finally {
        setSpinning(false);
      }
    };


  
    const onFinish = async (values) => {
      setSpinning(true);
      try {
        await axios.put(`http://localhost:3005/api/languagelevel/${id}`, values, {
          withCredentials: true,
        });
        messageApi.success("Sửa trình độ thành công");
        setTimeout(() => {
          navigate("/admin/languageslevel");
        }, 1000);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        messageApi.error(errorMsg);
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
            { title: <Link to="/admin/languageslevel">Quản lý trình độ</Link> },
            { title: `Cập nhật trình độ` },
          ]}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <Form.Item label="Mã trình độ (ID)" name="language_levelid">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên trình độ"
            name="language_level"
            rules={[{ required: true, message: "Vui lòng nhập tên trình độ" }]}
          >
            <Input placeholder="Ví dụ: A1, A2, A3,..." />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              disabled={spinning}
            >
              Cập nhật trình độ
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    );
  }
  
  export default UpdateLanguage;
  