import { Schema, model, Types } from 'mongoose';

const JoinRequestSchema = new Schema({
  partyId: { type: Types.ObjectId, ref: 'Party', index: true, required: true },
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  message: String,
}, { timestamps: true });

JoinRequestSchema.index({ partyId: 1, userId: 1 }, { unique: true });

export default model('JoinRequest', JoinRequestSchema);
