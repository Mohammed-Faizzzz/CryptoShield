const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isOrganizer: { type: Boolean, default: false },
  xrplWallet: {
      address: { type: String, unique: true, required: true }
      },
  ethereumAddress: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
