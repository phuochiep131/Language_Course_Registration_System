const mongoose = require('mongoose');

const StudyTimeSchema = new mongoose.Schema({
  day_of_week: { type: String, required: true },
  study_time: { type: String, required: true }
});

module.exports = mongoose.model('StudyTime', StudyTimeSchema);
