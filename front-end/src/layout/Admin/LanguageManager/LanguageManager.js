import { useEffect, useState } from 'react';
import {
    Button, Table, Flex, Breadcrumb, Modal, Form, Input, Spin, message 
} from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LanguageManager() {
    const [languages, setLanguages] = useState([]);
    const [open, setOpen] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const columns = [
        {
            title: 'Mã ngôn ngữ',
            dataIndex: '_id',
            width: 200,
        },
        {
            title: 'Ngôn ngữ',
            dataIndex: 'language',
        },
        {
            title: 'Sửa',
            dataIndex: '_id',
            render: (_id) =>
                <Link to={`update/${_id}`}>
                    {/* <i className="fa-solid fa-pen-to-square" style={{ color: "#00CC77", fontSize: "18px" }}></i> */}
                    suaaa
                </Link>,
            width: 60,
            align: "center"
        }

    ];

    const fetchData = () => {
        axios.get(`http://localhost:3005/api/language`, { withCredentials: true })
            .then(response => {
                const data = response.data.map(l => ({
                    key: l._id,
                    _id: l._id,
                    language: l.language,
                }));

                setLanguages(data);
            })
            .catch(err => console.error('Fetch error:', err));
    };

    const onFinish = (values) => {
        const alreadyExists = languages.some(lang =>
            lang.language.trim().toLowerCase() === values.language.trim().toLowerCase()
        );

        if (alreadyExists) {
            messageApi.open({
                key: 'language_exist',
                type: 'error',
                content: 'Ngôn ngữ này đã tồn tại!',
            });
            return;
        }

        setSpinning(true);
        setOpen(false);
        axios.post(`http://localhost:3005/api/language/add`, values, {
            withCredentials: true
        })
            .then(() => fetchData())
            .catch(error => console.error('Add error:', error))
            .finally(() => setSpinning(false));
    };

    const handleDelete = () => {
        setSpinning(true);
        setOpenDeleteConfirm(false);

        axios.delete(`http://localhost:3005/api/language/multiple`, {
            data: { languageIds: selectedRowKeys },
            withCredentials: true
        })
            .then(() => {
                fetchData();
                setSelectedRowKeys([]);
                messageApi.success('Xóa ngôn ngữ thành công!');
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    const msg = 'Không thể xóa. Có giáo viên đang sử dụng ngôn ngữ này.'
                    messageApi.error(msg);
                } else {
                    messageApi.error('Có lỗi xảy ra khi xoá ngôn ngữ!');
                }
            })
            .finally(() => setSpinning(false));
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Flex className="LanguageManager" vertical gap={20} style={{ position: "relative" }}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    { title: 'Admin Dashboard' },
                    { title: 'Quản lý ngôn ngữ' },
                ]}
            />
            <Flex>
                <Button type="primary" onClick={() => setOpen(true)}>Thêm ngôn ngữ</Button>
            </Flex>

            {selectedRowKeys.length > 0 &&
                <Flex align='center' justify='space-between'
                    style={{
                        padding: "10px 15px",
                        borderRadius: "5px",
                        backgroundColor: "white",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)",
                        position: "sticky",
                        top: "10px",
                        zIndex: 10
                    }}
                >
                    <span>Đã chọn {selectedRowKeys.length} ngôn ngữ</span>
                    <Button type="primary" danger onClick={() => setOpenDeleteConfirm(true)}>Xoá</Button>
                </Flex>
            }

            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: (newKeys) => setSelectedRowKeys(newKeys)
                }}
                columns={columns}
                dataSource={languages}
                bordered
            />

            {/* Modal xác nhận xóa */}
            <Modal
                open={openDeleteConfirm}
                title="Xác nhận xoá"
                onCancel={() => setOpenDeleteConfirm(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenDeleteConfirm(false)}>Quay lại</Button>,
                    <Button key="submit" type="primary" danger onClick={handleDelete}>Xoá</Button>
                ]}
                centered
            >
                <p>{selectedRowKeys.length} ngôn ngữ sẽ bị xoá vĩnh viễn. Bạn có chắc không?</p>
            </Modal>

            {/* Modal thêm ngôn ngữ */}
            <Modal
                open={open}
                title="Thêm ngôn ngữ mới"
                onCancel={() => setOpen(false)}
                footer={[]}
                width={400}
                centered
            >
                <Form onFinish={onFinish} layout="vertical">
                    {/* <Form.Item
                        label="Mã ngôn ngữ"
                        name="id"
                        rules={[{ required: true, message: 'Vui lòng nhập mã ngôn ngữ!' }]}
                    >
                        <Input placeholder="Nhập mã ngôn ngữ" allowClear />
                    </Form.Item> */}
                    <Form.Item
                        label="Ngôn ngữ"
                        name="language"
                        rules={[{ required: true, message: 'Vui lòng nhập tên ngôn ngữ!' }]}
                    >
                        <Input placeholder="Nhập tên ngôn ngữ" allowClear />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                            Tạo ngôn ngữ
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}

export default LanguageManager;
