const authService = require('../services/authService');
const config = require('../config/jwt');
const jwtSecret = config.SECRET_KEY

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

module.exports = {
    register,
    login,
    logout,
};
