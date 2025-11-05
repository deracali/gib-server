import mongoose from 'mongoose';
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Group', groupSchema);
