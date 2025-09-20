import { Schema, model, Types } from 'mongoose';

const GeoSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true } // [lng, lat]
}, { _id: false });

const PartySchema = new Schema({
  title: { type: String, required: true, index: 'text' },
  description: String,
  category: { type: String, index: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public', index: true },
  date: Date,
  startTime: String,
  endTime: String,
  location: {
    name: String,
    geo: { type: GeoSchema, index: '2dsphere' }
  },
  capacity: Number,
  price: { type: Number, default: 0 },
  hostId: { type: Types.ObjectId, ref: 'User', index: true },
  images: [String],
  tags: [String],
  attendeesCount: { type: Number, default: 0 },
}, { timestamps: true });

PartySchema.index({ title: 'text', description: 'text', tags: 'text' });

export default model('Party', PartySchema);
