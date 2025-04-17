const mongoose = require('mongoose');

const RegistrationCourseSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  study_time_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyTime' },
  study_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyLocation' },
  enrollment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration_Course', RegistrationCourseSchema);
