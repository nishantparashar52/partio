import { Schema, model } from 'mongoose';

const PhoneTokenSchema = new Schema({
  phone: { type: String, index: true, required: true, trim: true }, // ✅ store phone
  code: { type: String, required: true }, // 6-digit OTP (dev only, plain text)
  expiresAt: { type: Date, required: true }, // expiry date
}, { timestamps: true });

// ✅ Index for quick lookups and expiry cleanup
PhoneTokenSchema.index({ phone: 1, code: 1 });
PhoneTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model('PhoneToken', PhoneTokenSchema);