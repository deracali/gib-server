import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: String,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      required: false,
      trim: true,
    },
    field: {
      type: String,
      required: false,
      trim: true,
    },
    experience: {
      type: String,
      required: false,
      trim: true,
    },
    currentRole: {
      type: String,
      required: false,
      trim: true,
    },
    motivation: {
      type: String,
      required: false,
      trim: true,
    },
    applicationStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
