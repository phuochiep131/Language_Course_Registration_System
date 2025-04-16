const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true }
  // gender: { type: String, required: true },
  // address: { type: String, required: true },
  // avatar: { type: String, required: true },
  // role: { type: String, enum: ['User', 'Admin'], required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;