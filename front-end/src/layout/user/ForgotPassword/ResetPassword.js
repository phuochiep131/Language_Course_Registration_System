import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Button, Alert, Form } from 'antd';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy token từ query string
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const handleSubmit = async () => {
    setAlert({ type: '', message: '' });
    if (!token) {
      setAlert({ type: 'error', message: 'Link không hợp lệ hoặc đã hết hạn!' });
      return;
    }
    if (password.length < 6) {
      setAlert({ type: 'error', message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: 'Đổi mật khẩu thành công!' });
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi xảy ra!' });
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
          <h1 style={{ textAlign: 'center', fontSize: '20px' }}>ĐẶT LẠI MẬT KHẨU</h1>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
        >
          <Input.Password
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mật khẩu mới"
            size="large"
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="login-form-button" size="large" style={{ width: '100%' }}>
            Đổi mật khẩu
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

export default ResetPassword; 