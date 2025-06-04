const Teacher = require('../models/Teacher');

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('language_id');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('language_id');
    res.json(teacher);
  } catch (err) {
    res.status(404).json({ message: 'Teacher not found' });
  }
};

const createTeacher = async (req, res) => {
  console.log(req.body)
  try {
    const newTeacher = new Teacher({
      full_name: req.body.full_name,
      gender: req.body.gender,
      email: req.body.email,
      // avatar: req.body.avatar,
      language_id: req.body.language_id
    });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        full_name: req.body.full_name,
        email: req.body.email,
        // username: req.body.username,
        // password: req.body.password,
        // avatar: req.body.avatar,
        language_id: req.body.language_id
      },
      { new: true }
    );
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMultipleTeachers = async (req, res) => {
  try {
    const { teacherIds } = req.body;
    await Teacher.deleteMany({ _id: { $in: teacherIds } });
    res.json({ message: 'Teachers deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteMultipleTeachers,
};
