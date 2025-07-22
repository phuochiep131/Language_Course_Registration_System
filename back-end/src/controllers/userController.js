const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ message: "Invalid user ID format" });
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUsersByIds = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { userIds } = req.body;
    if (
      !Array.isArray(userIds) ||
      userIds.some((id) => !id.match(/^[0-9a-fA-F]{24}$/))
    )
      return res.status(400).json({ message: "Invalid user IDs format" });
    const result = await userService.deleteUsersByIds(userIds);
    if (!result)
      return res.status(404).json({ message: "One or more users not found" });
    res.json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserById = async (req, res) => {
  try {
    if (!req.user) 
      return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params; 
    if (!id.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ message: "Invalid user ID format" });

    const { fullname } = req.body;
    if (fullname && /[^a-zA-ZÀ-ỹ\s]/.test(fullname)) {
      return res.status(400).json({ message: "Họ tên không hợp lệ" });
    }

    const { address } = req.body;    
    if (address && /[^a-zA-ZÀ-ỹ,/0-9\s]/.test(address)) {
      return res.status(400).json({ message: "Địa chỉ không hợp lệ" });
    }

    const user = await userService.updateUserById(id, req.body);
    if (!user) return res.status(400).json({ message: "Bạn chỉ được phép sửa giới tính 1 lần duy nhất!" });

    res.json(user);
  } catch (error) {

    res.status(500).json({ message: "Internal Server Error" });
  }
};


const addRegistrationCourse = async (req, res) => {
  try {
    const user = await userService.addRegistrationCourse(
      req.params.id,
      req.body.course_id
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Registration added successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRegisteredCourses = async (req, res) => {
  try {
    const user = await userService.getRegisteredCourses(req.params.id);
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
  try {
    const result = await userService.unregisterCourse(
      req.params.id,
      req.params.courseId
    );
    if (result === null)
      return res.status(404).json({ message: "User not found" });
    if (!result)
      return res
        .status(400)
        .json({ message: "Course not found in registration" });
    res.json({ message: "Unregistered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllRegisteredCourses = async (req, res) => {
  try {
    const users = await userService.getAllRegisteredCourses();
    const allRegisteredCourses = [];

    users.forEach((user) => {
      user.registrationCourses.forEach((rc) => {
        if (rc.course_id) {
          allRegisteredCourses.push({
            user_id: user._id,
            userid: user.userid,
            name: user.fullname,
            avatar: user.avatar,
            course_id: rc.course_id._id,
            courseid: rc.course_id.courseid,
            language: rc.course_id.language_id?.language,
            languagelevel: rc.course_id.languagelevel_id?.language_level,
            teacher: rc.course_id.teacher_id?.full_name,
            enrollment_date: rc.enrollment_date,
          });
        }
      });
    });

    res.json(allRegisteredCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRegistration = async (req, res) => {
  try {
    const result = await userService.updateRegistration(
      req.params.userId,
      req.params.courseId,
      req.body.newCourseId
    );
    if (result.status === "not_found")
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    if (result.status === "registration_not_found")
      return res
        .status(404)
        .json({ message: "Không tìm thấy đăng ký khóa học cần cập nhật" });
    if (result.status === "already_registered")
      return res.status(400).json({ message: "Đã đăng ký khóa học này rồi" });

    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
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
