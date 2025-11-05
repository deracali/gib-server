import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/StudentsController.js";

const studentRoutes = express.Router();


studentRoutes.post("/create", createStudent);
studentRoutes.get("/get", getStudents);
studentRoutes.get("/:id", getStudentById);
studentRoutes.put("/update/:id", updateStudent);
studentRoutes.delete("/delete/:id", deleteStudent);

export default studentRoutes;
