const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  language: { type: String, required: true }
});

// const LanguageLevelSchema = new mongoose.Schema({
//   id: { type: String, required: true},
//   language_level: { type: String, required: true},
// }, { _id: false });

// const LanguageSchema = new mongoose.Schema({
//   language: { type: String, required: true},
//   levels: [LanguageLevelSchema],
// });

const Language = mongoose.model('Language', LanguageSchema);

module.exports = Language
