const mongoose = require('mongoose');

const StudyTimeSchema = new mongoose.Schema({
  day_of_week: { type: String },
  study_time: { type: String }
});

module.exports = mongoose.model('Study_Time', StudyTimeSchema);
