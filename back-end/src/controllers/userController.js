const User = require('../models/user');
//const Song = require('../models/song');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const Background = require('../models/background');

const getAllUsers = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Chỉ lấy danh sách người dùng nếu người dùng có quyền
        const users = await User.find();

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy id người dùng từ đường dẫn
        const userId = req.params.id;

        // Kiểm tra xem id có đúng định dạng MongoDB hay không
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Trả về thông tin người dùng
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        // Lấy id người dùng từ đối tượng req
        const userId = req.user.id;

        // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của người dùng hiện tại
        const currentUser = await User.findById(userId)

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Trả về thông tin người dùng
        res.json(currentUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getCurrentUser
};
