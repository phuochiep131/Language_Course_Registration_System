const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name_course: { type: String, required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  language_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' }
});

module.exports = mongoose.model('Course', CourseSchema);
