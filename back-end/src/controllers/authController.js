const authService = require('../services/authService');
const config = require('../config/jwt');
const jwtSecret = config.SECRET_KEY
const transporter = require('../config/mail');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {    
    const { fullname } = req.body;
    if (fullname && /[^a-zA-ZÀ-ỹ\s]/.test(fullname)) {
      return res.status(400).json({ message: "Họ tên không hợp lệ" });
    }

    const { address } = req.body;    
    if (address && /[^a-zA-ZÀ-ỹ,/0-9\s]/.test(address)) {
      return res.status(400).json({ message: "Địa chỉ không hợp lệ" });
    }

    try {
        const result = await authService.registerUser(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(201).json({ message: result.message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body, jwtSecret);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.cookie('token', result.token, { httpOnly: true });
        res.json({ token: result.token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Vui lòng nhập email!' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy email này!' });
    // Tạo token reset password, hết hạn 15 phút
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    // Link reset password
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    // Gửi mail với HTML đẹp
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '🔐 Yêu cầu đặt lại mật khẩu - Trung tâm ngoại ngữ DREAM',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Đặt lại mật khẩu</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🔐 Đặt lại mật khẩu</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Trung tâm ngoại ngữ DREAM</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px;">Xin chào ${user.fullname}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; text-decoration: none; padding: 15px 30px; 
                          border-radius: 25px; font-size: 16px; font-weight: 600; 
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); 
                          transition: all 0.3s ease;">
                  🔑 Đặt lại mật khẩu
                </a>
              </div>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>⚠️ Lưu ý quan trọng:</strong><br>
                  • Link này sẽ hết hạn sau <strong>15 phút</strong><br>
                  • Chỉ sử dụng link này một lần duy nhất<br>
                  • Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
                </p>
              </div>
              
              <p style="color: #999; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
                Nếu nút trên không hoạt động, bạn có thể copy link sau vào trình duyệt:<br>
                <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                <strong>Trung tâm ngoại ngữ DREAM</strong><br>
                📍 Số 126, Nguyễn Thiện Thành, Phường 5, TP - Trà Vinh<br>
                📞 0794 325 729 | 📧 dream@gmail.com
              </p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                © 2025 Trung tâm ngoại ngữ DREAM. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    res.json({ message: 'Đã gửi link đặt lại mật khẩu tới email của bạn!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi gửi mail!' });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Thiếu token hoặc mật khẩu mới!' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token đã hết hạn, vui lòng gửi lại yêu cầu quên mật khẩu.' });
    }
    res.status(400).json({ message: 'Token không hợp lệ hoặc lỗi khác!' });
  }
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
};
