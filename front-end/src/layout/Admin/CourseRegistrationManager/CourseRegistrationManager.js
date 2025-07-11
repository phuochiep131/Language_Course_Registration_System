import { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, Modal, Form, Input, message, Spin, Select } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function CourseRegistrationManager() {
    const [open, setOpen] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [users, setUsers] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    useEffect(() => {
    if (open) {
        form.resetFields();
    }
    }, [open]);

    const columns = [
        { 
            title: 'Mã khóa học', 
            dataIndex: 'courseid' 
        },
        { 
            title: 'Ngôn ngữ', 
            dataIndex: 'language' 
        },
        { 
            title: 'Trình độ', 
            dataIndex: 'languagelevel' 
        },
        { 
            title: 'Mã học viên', 
            dataIndex: 'userid' 
        },
        {
            title: 'Tên học viên',
            dataIndex: 'name',
            render: (_, record) => (
                <Flex align='center' gap={10}>
                    <h4 style={{ fontWeight: 600 }}>{record.name}</h4>
                </Flex>
            )
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'enrollment_date',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
        },
        {
            title: 'Giảng viên giảng dạy',
            dataIndex: 'teacher',            
        },
        {
            title: 'Sửa',
            dataIndex: 'update',
            render: (_, record) => (
                <Link to={`update-registration/${record.user_id}/${record.course_id}`}>Sửa</Link>
            ),
            width: 60,
            align: "center"
        }
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    const fetchData = async () => {
        setSpinning(true);        
        try {
            const [regRes, courseRes, userRes] = await Promise.all([
                axios.get("http://localhost:3005/api/user/registered-course", { withCredentials: true }),
                axios.get("http://localhost:3005/api/course", { withCredentials: true }),
                axios.get("http://localhost:3005/api/user", { withCredentials: true })
            ]);
            setRegistrations(regRes.data);
            setFilteredRegistrations(regRes.data);
            setCourses(courseRes.data);   
            setUsers(userRes.data)
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            messageApi.error("Không thể tải dữ liệu");
        } finally {
            setSpinning(false);
        }
    };

    const handleDelete = async () => {
        try {
            for (const key of selectedRowKeys) {           
                console.log(key)     
                const [userid, courseid] = key.split("-");
                console.log("Xoá đăng ký với userid:", userid, "và courseid:", courseid);
                await axios.delete(`http://localhost:3005/api/user/${userid}/unregister-course/${courseid}`, {
                    withCredentials: true
                });
            }
            messageApi.success("Xoá thành công!");
            setSelectedRowKeys([]);
            setOpenDeleteConfirm(false);
            fetchData();
        } catch (err) {
            console.error(err);
            messageApi.error("Lỗi khi xoá các đăng ký!");
        }
    };



    const onFinish = async (values) => {
        const { userid, course_id } = values;        
        const selectedStudent = users.find((s) => s.userid === userid);

        if (!selectedStudent) {
            messageApi.error("Không tìm thấy thông tin học viên!");
            return;
        }

        try {
            await axios.post(`http://localhost:3005/api/user/${selectedStudent._id}/register-course`, {
                course_id,
            }, {
                withCredentials: true
            });

            messageApi.success("Đăng ký thành công!")
            form.resetFields()
            setOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
            messageApi.error("Đăng ký thất bại!");
        }
    };

    const handleSearch = (value) => {
        const keyword = value?.toString().trim();
        if (!keyword) {
            setFilteredRegistrations(registrations);
            return;
        }

        const filtered = registrations.filter(reg =>
            String(reg.userid || '').includes(keyword)
        );

        setFilteredRegistrations(filtered);
    };

    const searchByName = (value) => {
        const keyword = value.trim().toLowerCase();
        const filtered = registrations.filter(reg =>
            String(reg.name || '').toLowerCase().includes(keyword)
        );
        setFilteredRegistrations(filtered);
    };


    useEffect(() => {        
        fetchData();
    }, []);

    return (
        <Flex className="UserManager" vertical gap={20} style={{ position: "relative" }}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    { title: 'Admin Dashboard' },
                    { title: 'Quản lý đăng ký khóa học' },
                ]}
            />
            <Flex>
                
            </Flex>

            <Flex gap={20}>
                <Button type="primary" onClick={() => setOpen(true)}>Thêm đăng ký mới</Button>                
                <Input.Search
                    placeholder="Tìm theo mã học viên"
                    allowClear                    
                    onChange={(e) => handleSearch(e.target.value.toString())}
                    style={{ width: 250 }}
                />
                <Input.Search
                    placeholder="Tìm theo tên học viên"
                    allowClear                    
                    onChange={(e) => searchByName(e.target.value.toString())}
                    style={{ width: 250 }}
                />
            </Flex>

            {selectedRowKeys.length > 0 && (
                <Flex align='center' justify='space-between'
                    style={{
                        padding: "10px 15px",
                        borderRadius: "5px",
                        backgroundColor: "white",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)",
                        position: "sticky",
                        top: "10px",
                        zIndex: "10"
                    }}
                >
                    <span>Đã chọn {selectedRowKeys.length} bản ghi</span>
                    <Button type='primary' danger onClick={() => setOpenDeleteConfirm(true)}>Xoá</Button>
                </Flex>
            )}

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredRegistrations}
                rowKey={(record) => `${record.user_id}-${record.course_id}`}
                bordered
            />

            <Modal
                open={open}
                title="Thêm đăng ký mới"
                onCancel={() => setOpen(false)}
                footer={null}
                width={400}
                centered
            >
                <Form 
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="userid"
                        label="Mã học viên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã học viên!' },
                            {
                                pattern: /^\d+$/,
                                message: 'Mã học viên chỉ được chứa số!',
                            },
                            {
                                len: 10,
                                message: 'Mã học viên phải gồm đúng 10 chữ số!',
                            }
                        ]}
                    >
                        <Input placeholder="Nhập mã học viên" allowClear />
                    </Form.Item>

                    <Form.Item
                        name="course_id"
                        label="Khóa học"
                        rules={[
                            { required: true, message: 'Vui lòng chọn khóa học!' }
                        ]}
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
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Xác nhận đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={openDeleteConfirm}
                title="Xác nhận xoá"
                onOk={() => setOpenDeleteConfirm(false)}
                onCancel={() => setOpenDeleteConfirm(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenDeleteConfirm(false)}>Quay lại</Button>,
                    <Button key="submit" type="primary" danger onClick={handleDelete}>Xoá</Button>
                ]}
                centered
            >
                <p>{selectedRowKeys.length} đăng ký sẽ bị xoá. Bạn chắc chắn?</p>
            </Modal>
        </Flex>
    );
}

export default CourseRegistrationManager;
