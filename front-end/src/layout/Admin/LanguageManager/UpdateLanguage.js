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
  
    const successMessage = () => {
      messageApi.open({
        type: "success",
        content: "Cập nhật thành công",
      });
    };
  
    const errorMessage = (msg) => {
      messageApi.open({
        type: "error",
        content: "Cập nhật thất bại, "+ msg,
      });
    };
  
    const fetchLanguage = async () => {
      //console.log(id)
      setSpinning(true);
      try {
        const res = await axios.get(`http://localhost:3005/api/language/${id}`, {
          withCredentials: true,
        });
        form.setFieldsValue({
          id: res.data._id, 
          language: res.data.language,
          languageid: res.data.languageid,
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
        const errorMsg = error.response?.data?.message || error.message                    
            errorMessage(errorMsg);
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
          <Form.Item label="Mã ngôn ngữ (ID)" name="languageid">
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
  