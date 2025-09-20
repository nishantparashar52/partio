import { Schema, model } from 'mongoose';

const EmailTokenSchema = new Schema({
  email: { type: String, index: true, required: true, lowercase: true, trim: true },
  code: { type: String, required: true }, // 6-digit code (dev only, plain text)
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

EmailTokenSchema.index({ email: 1, code: 1 });
EmailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model('EmailToken', EmailTokenSchema);
