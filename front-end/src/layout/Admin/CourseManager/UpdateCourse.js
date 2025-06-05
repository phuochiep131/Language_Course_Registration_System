import {
  Form,
  Input,
  Button,
  Breadcrumb,
  Flex,
  Spin,
  Select,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [languages, setLanguages] = useState([]);
  const [languageLevels, setLanguageLevels] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const successMessage = () => {
    messageApi.open({
      type: "success",
      content: "Cập nhật khóa học thành công",
    });
  };

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Cập nhật thất bại!",
    });
  };

  const fetchData = async () => {
    setSpinning(true);
    try {
      // Load dữ liệu khóa học cụ thể
      const courseRes = await axios.get(`http://localhost:3005/api/course/${id}`, {
        withCredentials: true,
      });

      // Load danh sách liên quan
      const [langRes, levelRes, teacherRes] = await Promise.all([
        axios.get("http://localhost:3005/api/language", { withCredentials: true }),
        axios.get("http://localhost:3005/api/languagelevel", { withCredentials: true }),
        axios.get("http://localhost:3005/api/teacher", { withCredentials: true }),
      ]);

      setLanguages(langRes.data);
      setLanguageLevels(levelRes.data);
      setTeachers(teacherRes.data);

      form.setFieldsValue({
        language_id: courseRes.data.language_id,
        languagelevel_id: courseRes.data.languagelevel_id,
        teacher_id: courseRes.data.teacher_id,
        start_date: courseRes.data.start_date?.slice(0, 10), // loại bỏ phần thời gian
        number_of_sessions: courseRes.data.number_of_sessions,
        tuition_fee: courseRes.data.tuition_fee,
        description: courseRes.data.description,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      errorMessage();
    } finally {
      setSpinning(false);
    }
  };

  const onFinish = async (values) => {
    setSpinning(true);
    try {
      await axios.put(`http://localhost:3005/api/course/${id}`, values, {
        withCredentials: true,
      });
      successMessage();
      setTimeout(() => {
        navigate("/admin/courses");
      }, 1000);
    } catch (error) {
      console.error("Lỗi cập nhật khóa học:", error);
      errorMessage();
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <Flex vertical gap={20}>
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Breadcrumb
        items={[
          { title: "Admin Dashboard" },
          { title: <Link to="/admin/courses">Quản lý khóa học</Link> },
          { title: "Cập nhật khóa học" },
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Form.Item
          name="language_id"
          label="Ngôn ngữ"
          rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ!" }]}
        >
          <Select placeholder="Chọn ngôn ngữ">
            {languages.map((lang) => (
              <Select.Option key={lang.id} value={lang.id}>
                {lang.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="languagelevel_id"
          label="Trình độ"
          rules={[{ required: true, message: "Vui lòng chọn trình độ!" }]}
        >
          <Select placeholder="Chọn trình độ">
            {languageLevels.map((lv) => (
              <Select.Option key={lv.id} value={lv.id}>
                {lv.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="teacher_id"
          label="Giảng viên"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
        >
          <Select placeholder="Chọn giảng viên">
            {teachers.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="start_date"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="number_of_sessions"
          label="Số tiết"
          rules={[{ required: true, message: "Vui lòng nhập số tiết!" }]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Form.Item
          name="tuition_fee"
          label="Học phí (VNĐ)"
          rules={[{ required: true, message: "Vui lòng nhập học phí!" }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} allowClear />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            disabled={spinning}
          >
            Cập nhật khóa học
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default UpdateCourse;
