// controllers/SiteController.js
import SiteSettings from "../model/SiteModel.js";

// Get site settings
export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Site settings not found" });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create or update site settings
export const createSiteSettings = async (req, res) => {
  try {
    const updateData = req.body; // Only include what’s sent

    let settings = await SiteSettings.findOne();

    if (settings) {
      // Only update the fields provided in the request
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          settings[key] = updateData[key];
        }
      });

      await settings.save();
      return res.status(200).json({
        message: "Site settings updated successfully",
        settings,
      });
    }

    // Create new settings if none exist
    settings = new SiteSettings(updateData);
    await settings.save();

    res.status(201).json({
      message: "Site settings created successfully",
      settings,
    });
  } catch (error) {
    console.error("Error creating/updating site settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Explicit update endpoint (same logic)
export const updateSiteSettings = async (req, res) => {
  try {
    const updateData = req.body;
    const settings = await SiteSettings.findOne();

    if (!settings) {
      return res.status(404).json({ message: "Site settings not found" });
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        settings[key] = updateData[key];
      }
    });

    await settings.save();

    res.json({
      message: "Site settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete site settings (optional)
export const deleteSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Site settings not found" });
    }

    await settings.deleteOne();
    res.json({ message: "Site settings deleted successfully" });
  } catch (error) {
    console.error("Error deleting site settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
