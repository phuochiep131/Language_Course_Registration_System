const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Admin']},
  fullname: { type: String },
  gender: { type: String },
  address: { type: String },
  email: { type: String },
  avatar: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;