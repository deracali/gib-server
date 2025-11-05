import Staff from "../model/StaffModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =========================
// CREATE STAFF ACCOUNT SecurePass123
// =========================
export const createStaff = async (req, res) => {
  try {
    const { name, email, password, role, access_controls } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      name,
      email,
      password: hashedPassword,
      role,
      access_controls,
    });

    await newStaff.save();

    res.status(201).json({
      message: "Staff created successfully",
      staff: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        access_controls: newStaff.access_controls,
      },
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Error creating staff", error: error.message });
  }
};

// =========================
// STAFF LOGIN
// =========================
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if staff exists
    const staff = await Staff.findOne({ email });
    if (!staff)
      return res.status(404).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: staff._id, email: staff.email, role: staff.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    // Update last login timestamp
    staff.last_login = new Date();
    await staff.save();

    res.status(200).json({
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        access_controls: staff.access_controls,
      },
    });
  } catch (error) {
    console.error("Error logging in staff:", error);
    res.status(500).json({ message: "Error logging in staff", error: error.message });
  }
};

// =========================
// GET ALL STAFF
// =========================
export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ name: 1 });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error: error.message });
  }
};

// =========================
// GET ONE STAFF BY ID
// =========================
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error: error.message });
  }
};

// =========================
// UPDATE STAFF
// =========================
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password provided, hash it before saving
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updated = await Staff.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({
      message: "Staff updated successfully",
      staff: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff", error: error.message });
  }
};

// =========================
// DELETE STAFF
// =========================
export const deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error: error.message });
  }
};
