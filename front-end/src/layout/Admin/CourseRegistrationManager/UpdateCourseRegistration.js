import { Form, Select, Button, Breadcrumb, Flex, Spin, message, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function UpdateCourseRegistration() {
    const { userId, courseId } = useParams();    

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [courses, setCourses] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = () => {
        messageApi.open({
            type: "success",
            content: "Cập nhật đăng ký thành công",
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
            const [courseRes, userRes] = await Promise.all([
                axios.get("http://localhost:3005/api/course", { withCredentials: true }),
                axios.get(`http://localhost:3005/api/user/${userId}`, { withCredentials: true })
            ]);

            setCourses(courseRes.data);

            form.setFieldsValue({
                userid: userRes.data.userid,
                name: userRes.data.fullname
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            messageApi.error("Không thể tải dữ liệu");
        } finally {
            setSpinning(false);
        }
    };


    const onFinish = async (values) => {        
        setSpinning(true);
        try {
            await axios.put(`http://localhost:3005/api/user/update-registration/${userId}/${courseId}`, {
                newCourseId: values.course_id
            }, {
                withCredentials: true
            });                    
            successMessage();
            setTimeout(() => {
                navigate("/admin/registercourses");
            }, 1000);
        } catch (error) {
            console.error("Lỗi cập nhật:", error.response?.data?.message || error.message);
            errorMessage();
        } finally {
            setSpinning(false);
        }
    };    

    useEffect(() => {
        fetchData();
    }, [userId, courseId]);

    return (
        <Flex className="UpdateCourseRegistration" vertical gap={20}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    { title: "Admin Dashboard" },
                    { title: <Link to="/admin/registercourses">Quản lý đăng ký học</Link> },
                    { title: `Cập nhật đăng ký học` },
                ]}
            />
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 400, margin: "0 auto" }}
            >
                <Form.Item label="Mã học viên" name="userid">
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Tên học viên" name="name">
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Cập nhật khóa học"
                    name="course_id"
                    rules={[{ required: true, message: "Vui lòng chọn khóa học" }]}
                >
                    <Select placeholder="Chọn khóa học">
                        {courses.map(course => (
                            <Select.Option key={course.id} value={course.id}>
                                {course.courseid} - {course.language} - {course.languagelevel}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block disabled={spinning}>
                        Cập nhật đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}

export default UpdateCourseRegistration;
