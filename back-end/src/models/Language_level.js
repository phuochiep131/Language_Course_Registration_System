const mongoose = require('mongoose');

const LanguageLevelSchema = new mongoose.Schema({
  language_level: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Language_Level', LanguageLevelSchema);
