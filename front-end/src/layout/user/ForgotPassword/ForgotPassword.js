import React, { useState } from 'react';
import './ForgotPassword.css';
import { Input, Button, Alert, Form } from 'antd';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleSubmit = async () => {
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: 'Vui lòng kiểm tra email để nhận link đặt lại mật khẩu!' });
        setEmail('');
      } else {
        if (data.message === 'Không tìm thấy email này!') {
          setAlert({ type: 'error', message: 'Email này chưa từng được đăng ký trong hệ thống!' });
        } else {
          setAlert({ type: 'error', message: data.message || 'Có lỗi xảy ra!' });
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Không thể kết nối máy chủ!' });
    }
    setLoading(false);
  };

  return (
    <div className="Login">
      <Form
        className="login-form"
        style={{ width: 350 }}
        onFinish={handleSubmit}
      >
        <Form.Item>
          <h1 style={{ textAlign: 'center', fontSize: '20px' }}>QUÊN MẬT KHẨU</h1>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            size="large"
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="login-form-button" size="large" style={{ width: '100%' }}>
            Gửi link đặt lại mật khẩu
          </Button>
        </Form.Item>
        {alert.message && (
          <Form.Item>
            <Alert style={{ marginTop: 8 }} message={alert.message} type={alert.type} showIcon />
          </Form.Item>
        )}
        <Form.Item>
          <a href="/login">Quay lại đăng nhập</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
