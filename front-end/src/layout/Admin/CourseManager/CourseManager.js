import { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, Modal, Form, Input, Select, Spin, Badge } from 'antd';
import axios from 'axios';

function CourseManager() {
    const [open, setOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [courses, setCourses] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [languagelevel, setlanguagelevel] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const columns = [       
        {
            title: 'Ngôn ngữ',
            dataIndex: 'language_id',
            render: (langId) => {
                const lang = languages.find(l => l.id === langId);
                return <Badge color="blue" count={lang ? lang.name : langId} />;
            },
            filters: languages.map(lang => ({
                text: lang.name,
                value: lang.id,
            })),
            onFilter: (value, record) => record.language_id === value,
        },
        {
            title: 'Trình độ',
            dataIndex: 'languagelevel_id',
            render: (lglvId) => {
                const lv = languagelevel.find(c => c.id === lglvId);
                return lv ? lv.name : lglvId;
            }
        },
        {
            title: 'Giảng viên',
            dataIndex: 'teacher_id',
            render: (teacherId) => {
                const teacher = teachers.find(t => t.id === teacherId);
                return teacher ? teacher.name : teacherId;
            },
            width: 200,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
        },
        {
            title: 'Số tiết',
            dataIndex: 'number_of_sessions',
        },
        {
            title: 'Học phí (VNĐ)',
            dataIndex: 'tuition_fee',
            render: (fee) => fee?.toLocaleString() + ' ₫'
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 250,
        },    
        {
            title: 'Sửa',
            dataIndex: 'id',
            render: (id) => (
                <a href={`update/${id}`}>Sửa</a>
            ),
            width: 60,
            align: "center"
        }
    ];

    const fetchData = () => {
        setSpinning(true);
        Promise.all([
            axios.get('http://localhost:3005/api/course', { withCredentials: true }),
            axios.get('http://localhost:3005/api/language', { withCredentials: true }),
            axios.get('http://localhost:3005/api/teacher', { withCredentials: true }),
            axios.get('http://localhost:3005/api/languagelevel', { withCredentials: true }),
        ])
        .then(([courseRes, langRes, teacherRes, languagelevelRes]) => {
            setCourses(courseRes.data.map(course => ({
                ...course,
                key: course.id,
            })));
            setLanguages(langRes.data);
            setTeachers(teacherRes.data);
            setlanguagelevel(languagelevelRes.data);
            setSpinning(false);
        })
        .catch(err => {
            console.error(err);
            setSpinning(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showModal = () => setOpen(true);
    const showDeleteConfirm = () => setOpenDeleteConfirm(true);

    const handleDelete = () => {
        setSpinning(true);
        setOpenDeleteConfirm(false);

        axios.delete(`http://localhost:3005/api/course/multiple`, {
            data: { courseIds: selectedRowKeys },
            withCredentials: true
        })
        .then(() => {
            fetchData();
            setSelectedRowKeys([]);
        })
        .catch(err => console.log(err))
        .finally(() => setSpinning(false));
    };

    const onFinish = (values) => {
        setSpinning(true);
        setOpen(false);

        axios.post(`http://localhost:3005/api/course`, values, {
            withCredentials: true
        })
        .then(() => fetchData())
        .catch(err => console.log(err))
        .finally(() => setSpinning(false));
    };

    return (
        <Flex vertical gap={20} style={{ position: "relative" }}>
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb items={[{ title: 'Admin Dashboard' }, { title: 'Quản lý khóa học' }]} />
            <Flex>
                <Button type="primary" onClick={showModal}>Thêm khóa học</Button>
            </Flex>

            {selectedRowKeys.length > 0 && (
                <Flex align='center' justify='space-between' style={{ backgroundColor: "#fff", padding: 10, borderRadius: 5, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                    <span>Đã chọn {selectedRowKeys.length} khóa học</span>
                    <Button danger onClick={showDeleteConfirm}>Xoá</Button>
                </Flex>
            )}

            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys
                }}
                columns={columns}
                dataSource={courses}
                bordered
            />

            {/* Modal xác nhận xoá */}
            <Modal
                open={openDeleteConfirm}
                title="Xác nhận xoá"
                onCancel={() => setOpenDeleteConfirm(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenDeleteConfirm(false)}>Quay lại</Button>,
                    <Button key="submit" danger type="primary" onClick={handleDelete}>Xoá</Button>,
                ]}
                centered
            >
                <p>{selectedRowKeys.length} khóa học sẽ bị xoá vĩnh viễn. Tiếp tục?</p>
            </Modal>

            {/* Modal thêm mới */}
            <Modal
                open={open}
                title="Thêm khóa học mới"
                onCancel={() => setOpen(false)}
                footer={null}
                centered
            >
                <Form layout="vertical" onFinish={onFinish}>
                    {/* <Form.Item name="name_course" label="Tên khóa học" rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}>
                        <Input allowClear />
                    </Form.Item>                                         */}
                    <Form.Item name="language_id" label="Ngôn ngữ" rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ!' }]}>
                        <Select placeholder="Chọn ngôn ngữ">
                            {languages.map(lang => (
                                <Select.Option key={lang.id} value={lang.id}>{lang.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="languagelevel_id" label="Trình độ" rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}>
                        <Select placeholder="Chọn trình độ">
                            {languagelevel.map(cat => (
                                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="teacher_id" label="Giảng viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}>
                        <Select placeholder="Chọn giảng viên">
                            {teachers.map(teacher => (
                                <Select.Option key={teacher.id} value={teacher.id}>{teacher.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="start_date" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item name="number_of_sessions" label="Số tiết" rules={[{ required: true, message: 'Vui lòng nhập số tiết!' }]}>
                        <Input type="number" min={1} />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} allowClear />
                    </Form.Item>

                    <Form.Item name="tuition_fee" label="Học phí (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}>
                        <Input type="number" min={0} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Tạo khóa học</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}

export default CourseManager;
