import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, index: true, required: true, lowercase: true, trim: true },
  avatarUrl: String,
}, { timestamps: true });

export default model('User', UserSchema);
