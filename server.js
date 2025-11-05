import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


import applicationRoutes from "./routes/ApplicationRoute.js";
import courseRoutes from "./routes/CoursesRoute.js";
import studentRoutes from "./routes/StudentsRoute.js";
import staffRoutes from "./routes/StaffRoute.js";
import siteSettingsRoutes from "./routes/SiteRoute.js";
import paymentRoutes from "./routes/payment.js";
import chatRoutes from './routes/messageRoute.js';
import groupRoutes from './routes/groupRoute.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/applications", applicationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/payments", paymentRoutes);

app.use('/api/messages', chatRoutes);
app.use('/api/groups', groupRoutes);


// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
