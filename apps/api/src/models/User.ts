import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, trim: true },
  phone: { type: String, unique: true, required: true, index: true, trim: true },
  avatarUrl: String,
}, { timestamps: true });

export default model('User', UserSchema);
