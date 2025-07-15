import React, { useState } from 'react';
import './ForgotPassword.css';
import { Input, Button, message } from 'antd';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success('Vui lòng kiểm tra email để nhận link đặt lại mật khẩu!');
        setEmail('');
      } else {
        message.error(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      message.error('Không thể kết nối máy chủ!');
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label htmlFor="email">Nhập email của bạn:</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <Button type="primary" htmlType="submit" loading={loading} className="forgot-password-btn">
          Gửi link đặt lại mật khẩu
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
