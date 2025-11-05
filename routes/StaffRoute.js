import express from "express";
import {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  staffLogin,
} from "../controllers/staffController.js";

const staffRoutes = express.Router();

staffRoutes.post("/create", createStaff);
staffRoutes.post("/login", staffLogin);
staffRoutes.get("/get", getStaff);
staffRoutes.get("/:id", getStaffById);
staffRoutes.put("/update/:id", updateStaff);
staffRoutes.delete("/delete/:id", deleteStaff);

export default staffRoutes;
