const User = require("../models/user");
//const Song = require('../models/song');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//const Background = require('../models/background');

const getAllUsers = async (req, res) => {
  try {
    // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Chỉ lấy danh sách người dùng nếu người dùng có quyền
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Lấy id người dùng từ đường dẫn
    const userId = req.params.id;

    // Kiểm tra xem id có đúng định dạng MongoDB hay không
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Kiểm tra xem người dùng có tồn tại hay không
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Lấy id người dùng từ đối tượng req
    const userId = req.user.id;

    // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của người dùng hiện tại
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng
    res.json(currentUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUsersByIds = async (req, res) => {
  try {
    // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Lấy danh sách id người dùng từ request body
    const { userIds } = req.body;

    // Kiểm tra xem userIds có đúng định dạng hay không
    if (
      !Array.isArray(userIds) ||
      userIds.some((id) => !id.match(/^[0-9a-fA-F]{24}$/))
    ) {
      return res.status(400).json({ message: "Invalid user IDs format" });
    }

    // Kiểm tra xem các người dùng có tồn tại hay không
    const users = await User.find({ _id: { $in: userIds } });

    if (users.length !== userIds.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }

    // Xoá các người dùng khỏi cơ sở dữ liệu
    await User.deleteMany({ _id: { $in: userIds } });

    // Trả về thông báo thành công
    res.json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserById = async (req, res) => {
  try {
    // Kiểm tra xem req.user đã được đặt từ middleware xác thực hay chưa
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addRegistrationCourse = async (req, res) => {
  try {
    const userId = req.params.id;
    const { course_id } = req.body;
    console.log(course_id);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.registrationCourses.push({ course_id });
    await user.save();

    res.json({ message: "Registration added successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRegisteredCourses = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate({
      path: "registrationCourses.course_id",
      populate: [
        { path: "language_id" },
        { path: "languagelevel_id" },
        { path: "teacher_id" },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const registeredCourses = user.registrationCourses.map((rc) => ({
      course: rc.course_id,
      enrollment_date: rc.enrollment_date,
    }));

    res.json(registeredCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const unregisterCourse = async (req, res) => {
  const { id, courseId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const before = user.registrationCourses.length;
    user.registrationCourses = user.registrationCourses.filter(
      (rc) => rc.course_id.toString() !== courseId
    );

    if (user.registrationCourses.length === before) {
      return res
        .status(400)
        .json({ message: "Course not found in registration" });
    }

    await user.save();
    res.json({ message: "Unregistered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserById,
  deleteUsersByIds,
  addRegistrationCourse,
  getRegisteredCourses,
  unregisterCourse,
};
