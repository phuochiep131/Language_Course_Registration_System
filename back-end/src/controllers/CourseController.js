const Course = require('../models/Course');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('language_id')
      .populate('languagelevel_id')
      .populate('teacher_id');
    
    const result = courses.map(course => ({
      id: course._id.toString(),
      language_id: course.language_id?._id.toString(),
      languagelevel_id: course.languagelevel_id?._id.toString(),
      teacher_id: course.teacher_id?._id.toString(),
      Start_Date: course.Start_Date,
      Number_of_periods: course.Number_of_periods,
      Tuition: course.Tuition,
      Description: course.Description
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course is not exist' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCourse = async (req, res) => {
  try {
    const newCourse = new Course({
      language_id: req.body.language_id,
      languagelevel_id: req.body.languagelevel_id,
      teacher_id: req.body.teacher_id,
      Start_Date: req.body.Start_Date,
      Number_of_periods: req.body.Number_of_periods,
      Tuition: req.body.Tuition,
      Description: req.body.Description || ''
    });

    const saved = await newCourse.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMultipleCourses  = async (req, res) => {
  try {
    const { courseIds } = req.body;
    if (!Array.isArray(courseIds)) {
      return res.status(400).json({ message: 'courseIds must be an array' });
    }

    await Course.deleteMany({ _id: { $in: courseIds } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    getAllCourses,
    createCourse,
    getCourseById,
    updateCourse,
    deleteMultipleCourses 
}