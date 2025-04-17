const mongoose = require('mongoose');

const StudyLocationSchema = new mongoose.Schema({
  room: { type: String, required: true },
  study_location: { type: String }
});

module.exports = mongoose.model('Study_Location', StudyLocationSchema);
