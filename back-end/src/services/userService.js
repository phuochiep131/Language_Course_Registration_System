const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (userId) => {
  return await User.findById(userId);
};

const getCurrentUser = async (userId) => {
  return await User.findById(userId);
};

const deleteUsersByIds = async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });
  if (users.length !== userIds.length) return null;
  await User.deleteMany({ _id: { $in: userIds } });
  return true;
};

const updateUserById = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (data.fullname) user.fullname = data.fullname;
  if (data.email) user.email = data.email;
  if (data.username) user.username = data.username;
  if (data.password) user.password = await bcrypt.hash(data.password, 10);
  if (data.address) user.address = data.address;
  if (data.role) user.role = data.role;
  if (data.avatar) user.avatar = data.avatar;

  // Chỉ cho phép sửa giới tính 1 lần duy nhất
  if (data.gender !== undefined) {
    if (user.genderEdited) {
      // Đã từng sửa rồi, không cho phép sửa nữa
      return null;
    } else {
      user.gender = data.gender;
      user.genderEdited = true;
    }
  }

  await user.save();
  return user;
};

const addRegistrationCourse = async (userId, course_id) => {
  const user = await User.findById(userId);
  if (!user) return null;
  user.registrationCourses.push({ course_id });
  await user.save();
  return user;
};

const getRegisteredCourses = async (userId) => {
  return await User.findById(userId).populate({
    path: "registrationCourses.course_id",
    populate: [
      { path: "language_id" },
      { path: "languagelevel_id" },
      { path: "teacher_id" },
    ],
  });
};

const unregisterCourse = async (userId, courseId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  const before = user.registrationCourses.length;
  user.registrationCourses = user.registrationCourses.filter(
    (rc) => rc.course_id.toString() !== courseId
  );
  if (user.registrationCourses.length === before) return false;
  await user.save();
  return true;
};

const getAllRegisteredCourses = async () => {
  return await User.find({
    role: "Student",
    registrationCourses: { $exists: true, $ne: [] },
  }).populate({
    path: "registrationCourses.course_id",
    populate: [
      { path: "language_id" },
      { path: "languagelevel_id" },
      { path: "teacher_id" },
    ],
  });
};

const updateRegistration = async (userId, courseId, newCourseId) => {
  const user = await User.findById(userId);
  if (!user) return { status: "not_found" };

  const index = user.registrationCourses.findIndex(
    (reg) => reg.course_id.toString() === courseId
  );

  if (index === -1) return { status: "registration_not_found" };

  const existed = user.registrationCourses.find(
    (reg) => reg.course_id.toString() === newCourseId
  );

  if (existed) return { status: "already_registered" };

  user.registrationCourses[index].course_id = newCourseId;
  user.registrationCourses[index].enrollment_date = new Date();
  await user.save();
  return { status: "success" };
};

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  deleteUsersByIds,
  updateUserById,
  addRegistrationCourse,
  getRegisteredCourses,
  unregisterCourse,
  getAllRegisteredCourses,
  updateRegistration,
};
