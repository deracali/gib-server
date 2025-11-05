import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Accountant", "Admissions Officer", "Instructor"],
      default: "Instructor",
    },

    // Access permissions like ["dashboard", "students", "courses", ...]
    access_controls: {
      type: [String],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },

    last_login: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Automatically assign default permissions by role if not specified
staffSchema.pre("save", function (next) {
  if (!this.access_controls || this.access_controls.length === 0) {
    const ROLE_PERMISSIONS = {
      Admin: [
        "dashboard",
        "students",
        "applications",
        "enrollments",
        "courses",
        "staff",
        "messages",
        "mailing_lists",
        "website_editor",
        "settings",
      ],
      Accountant: ["dashboard", "students", "enrollments", "settings"],
      "Admissions Officer": [
        "dashboard",
        "students",
        "applications",
        "messages",
        "mailing_lists",
      ],
      Instructor: ["dashboard", "students", "courses", "messages"],
    };

    this.access_controls = ROLE_PERMISSIONS[this.role] || [];
  }
  next();
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
