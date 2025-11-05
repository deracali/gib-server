import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    site_title: { type: String, required: true },
    site_description: { type: String, required: true },
    contact_email: { type: String, required: true },
    contact_phone: { type: String, required: true },
    contact_address: { type: String, required: true },

    // New field: Application Fee
    applicationFee: { type: Number, default: 0 },

    // New field: Account Details
    account_details: {
      account_name: { type: String },
      account_number: { type: String },
      bank_name: { type: String },
    },
  },
  { timestamps: true }
);

// Export a single document model
export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
