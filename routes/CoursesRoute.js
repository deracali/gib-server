import express from "express";
import fileUpload from "express-fileupload";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/CoursesController.js";

const courseRoutes = express.Router();

courseRoutes.use(
  fileUpload({
    useTempFiles: false, // ✅ Correct for streamifier-based uploads
    limits: { fileSize: 15 * 1024 * 1024 }, // optional
  })
);



courseRoutes.post("/create", createCourse);        // Create
courseRoutes.get("/get", getCourses);           // Read all
courseRoutes.get("/:id", getCourseById);     // Read one
courseRoutes.put("/update/:id", updateCourse);      // Update
courseRoutes.delete("/delete/:id", deleteCourse);   // Delete

export default courseRoutes;
