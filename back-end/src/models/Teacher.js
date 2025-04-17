const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  gender: { type: String },
  email: { type: String, required: true, unique: true },
  language_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' },
  avatar: { type: String }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
