import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true, // each message belongs to a group
  },
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String, // store staff email
    required: true,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Message', messageSchema);
