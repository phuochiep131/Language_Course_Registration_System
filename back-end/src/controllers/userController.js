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

const deleteUsersByIds = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Lấy danh sách id người dùng từ request body
        const { userIds } = req.body;

        // Kiểm tra xem userIds có đúng định dạng hay không
        if (!Array.isArray(userIds) || userIds.some(id => !id.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ message: 'Invalid user IDs format' });
        }

        // Kiểm tra xem các người dùng có tồn tại hay không
        const users = await User.find({ _id: { $in: userIds } });

        if (users.length !== userIds.length) {
            return res.status(404).json({ message: 'One or more users not found' });
        }

        // Xoá các người dùng khỏi cơ sở dữ liệu
        await User.deleteMany({ _id: { $in: userIds } });

        // Trả về thông báo thành công
        res.json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUserById = async (req, res) => {
    try {
        // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        const userId = req.params.id;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.fullname) {
            user.fullname = req.body.fullname;
        }
        
        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        if (req.body.role) {
            user.role = req.body.role;
        }

        if (req.body.avatar) {
            user.avatar = req.body.avatar;
        }

        // Lưu các thay đổi
        await user.save();

        // Trả về thông tin người dùng sau khi cập nhật
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getCurrentUser,
    updateUserById,
    deleteUsersByIds
};
