import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy token từ query string
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      message.error('Link không hợp lệ hoặc đã hết hạn!');
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
        message.success('Đổi mật khẩu thành công!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        message.error(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      message.error('Không thể kết nối máy chủ!');
    }
    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <label htmlFor="password">Nhập mật khẩu mới:</label>
        <Input.Password
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Mật khẩu mới"
        />
        <Button type="primary" htmlType="submit" loading={loading} className="reset-password-btn">
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword; 