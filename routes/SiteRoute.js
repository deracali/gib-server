// routes/siteSettingsRoutes.ts
import express from "express";
import {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
} from "../controllers/SiteController.js";

const siteSettingsRoutes = express.Router();

siteSettingsRoutes.get("/get", getSiteSettings);
siteSettingsRoutes.post("/create", createSiteSettings);
siteSettingsRoutes.put("/update", updateSiteSettings);
siteSettingsRoutes.delete("/delete", deleteSiteSettings);

export default siteSettingsRoutes;
