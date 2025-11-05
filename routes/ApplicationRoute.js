import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updatePaymentStatus,
  updateApplicationStatus
} from "../controllers/ApplicationController.js";

const applicationRoutes = express.Router();

applicationRoutes.post("/create", createApplication);         // Create
applicationRoutes.get("/get", getApplications);            // Read all
applicationRoutes.get("/:id", getApplicationById);      // Read one
applicationRoutes.put("/update:id", updateApplication);       // Update
applicationRoutes.delete("/delete/:id", deleteApplication);    // Delete
applicationRoutes.patch("/:id/payment-status", updatePaymentStatus);
applicationRoutes.patch("/:id/status", updateApplicationStatus);


export default applicationRoutes;
