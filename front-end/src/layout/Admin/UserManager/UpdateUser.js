
import { LockOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Form, Input, Select, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateUser() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [spinning, setSpinning] = useState(true);
    const [userData, setUserData] = useState();

    const successMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: 'Cập nhật thành công',
        });
    };

    const errorMessage = (msg) => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: `Cập nhật thất bại, ${msg}`,
        });
    };
 

    const handleUpdateById = (newData) => {
        axios.put(`http://localhost:3005/api/user/${id}`, newData, {
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                successMessage();
                setSpinning(true);
                setTimeout(() => {
                    navigate('/admin/users');
                }, 1000);
            })
            .catch(error => {
                //console.error('Error fetching data:', error);
                const errorMsg = error.response?.data?.message || error.message
                errorMessage(errorMsg);
            });
    }

    const onFinish = async (values) => {
        setSpinning(true);
        const newUserData = {
            username: values.username,
            password: values.password,
            email: values.email,
            fullname: values.name,            
            address: values.address,
            role: values.role
        };
        console.log(id);

        handleUpdateById(newUserData);
        setSpinning(false);
    };


    const fecthUserData = async () => {
        setSpinning(true);
        axios.get(`http://localhost:3005/api/user/${id}`, {
            withCredentials: true
        })
            .then(response => {
                //console.log(response.data);
                setUserData(response.data);                
                setSpinning(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        fecthUserData();
    },[])

    return (
        <Flex className="UpdateUser" vertical gap={20}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: <Link to="/admin/users">Quản lý người dùng</Link>,
                    },
                    {
                        title: 'Cập nhật',
                    },
                    {
                        title: userData?.name,
                    },
                ]}
            />
            {
                userData &&
                <Form
                    name="dream_login"
                    className="login-form"
                    layout='vertical'
                    style={{
                        width: "400px",
                        margin: "0 auto",
                    }}
                    initialValues={{
                        userid: userData.userid,
                        name: userData.fullname,
                        gender: userData.gender,
                        email: userData.email,
                        username: userData.username,
                        address: userData.address,
                        role: userData.role,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="userid"
                        label="ID"                        
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                    >
                        <Input prefix={<SmileOutlined className="site-form-item-icon" />} placeholder="Họ và tên" allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Giới tính"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Nhập mật khẩu"
                            allowClear
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"                        
                    >
                        <Input prefix={<SmileOutlined className="site-form-item-icon" />} placeholder="Địa chỉ  " allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Tài khoản"
                    >
                        <Select placeholder="Loại tài khoản" size="large">
                            <Select.Option value="Student">Student</Select.Option>                       
                            <Select.Option value="Admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>                    
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="large" style={{ width: "100%" }}>
                            Cập nhật thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            }

        </Flex>
    );
}

export default UpdateUser;