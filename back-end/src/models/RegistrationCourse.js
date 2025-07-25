const mongoose = require('mongoose');

const RegistrationCourseSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enrollment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration_Course', RegistrationCourseSchema);
