import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true, // e.g. "Industry Gold Standard" or "Institutional Certificate"
    },
    description: {
      type: String,
      trim: true, // e.g. "Globally recognized cybersecurity certification..."
    },
  },
  { _id: false }
);

const CurriculumSchema = new mongoose.Schema(
  {
    week: { type: String, trim: true },
    title: { type: String, trim: true },
    topics: [String],
  },
  { _id: false }
);

// ✅ Added sub-schema for whatYouLearn (title + description)
const WhatYouLearnSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

// ✅ Added sub-schema for careerOutcomes (title + salary + description)
const CareerOutcomeSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    salary: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Mixed, // number or string
    },
    level: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    students: {
      type: String,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
    },
    certification: {
      type: String,
    },
    certifications: {
      type: [CertificationSchema],
      default: [],
    },
    popular: {
      type: Boolean,
      default: false,
    },
    // ✅ Updated: array of objects, not strings
    whatYouLearn: {
      type: [WhatYouLearnSchema],
      default: [],
    },
    // ✅ Updated: array of objects, not strings
    careerOutcomes: {
      type: [CareerOutcomeSchema],
      default: [],
    },
    curriculum: {
      type: [CurriculumSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
