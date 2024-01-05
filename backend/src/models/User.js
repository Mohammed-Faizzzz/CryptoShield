const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isOrganizer: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);