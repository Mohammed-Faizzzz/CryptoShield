import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isOrganizer: { type: Boolean, default: false },
  xrplWallet: {
      address: { type: String, unique: true, required: true }
      }
});

module.exports = models.User || model('User', UserSchema);
