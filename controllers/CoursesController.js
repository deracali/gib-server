import { v2 as cloudinary } from "cloudinary";
import Course from "../model/CoursesModel.js";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();




// 🔧 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Helper: Upload image using streamifier
const uploadImage = async (file) => {
  const MAX_FILE_SIZE_MB = 10;
  const fileSizeMB = file.size / (1024 * 1024);

  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    throw new Error(
      `Image "${file.name}" is too large (${fileSizeMB.toFixed(
        2
      )} MB). Max allowed size is ${MAX_FILE_SIZE_MB} MB.`
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "courses",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        console.log("✅ Uploaded:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.data).pipe(uploadStream);
  });
};


export const createCourse = async (req, res) => {
  try {
    console.log("📝 Incoming body:", req.body);
    console.log("📸 Incoming files keys:", Object.keys(req.files || {}));

    const raw = { ...req.body };

    // Parse possibly stringified JSON arrays (handles double-encoded JSON)
    raw.skills = tryParseJSON(raw.skills) ?? [];
    raw.whatYouLearn = tryParseJSON(raw.whatYouLearn) ?? [];
    raw.careerOutcomes = tryParseJSON(raw.careerOutcomes) ?? [];
    raw.certifications = tryParseJSON(raw.certifications) ?? [];
    raw.curriculum = tryParseJSON(raw.curriculum) ?? [];

    // Ensure arrays
    raw.skills = ensureArray(raw.skills);
    raw.whatYouLearn = ensureArray(raw.whatYouLearn);
    raw.careerOutcomes = ensureArray(raw.careerOutcomes);
    raw.certifications = ensureArray(raw.certifications);
    raw.curriculum = ensureArray(raw.curriculum);

    // Normalize subdocuments (whatYouLearn, careerOutcomes, certifications, curriculum)
    raw.whatYouLearn = raw.whatYouLearn.map(normalizeItem);
    raw.careerOutcomes = raw.careerOutcomes.map((it) => {
      let parsed = it;
      if (typeof parsed === "string") parsed = tryParseJSON(parsed) ?? parsed;
      if (typeof parsed === "string") return { title: parsed, salary: "", description: "" };
      const cm = charMapToString(parsed);
      if (typeof cm === "string") return { title: cm, salary: "", description: "" };
      return {
        title: parsed.title ?? parsed.name ?? "",
        salary: parsed.salary ?? "",
        description: parsed.description ?? "",
      };
    });

    raw.certifications = raw.certifications.map((it) => {
      let parsed = it;
      if (typeof parsed === "string") parsed = tryParseJSON(parsed) ?? parsed;
      if (typeof parsed === "string") return { name: parsed, type: "", description: "" };
      const cm = charMapToString(parsed);
      if (typeof cm === "string") return { name: cm, type: "", description: "" };
      return { name: parsed.name ?? "", type: parsed.type ?? "", description: parsed.description ?? "" };
    });

    // curriculum modules normalization
    raw.curriculum = raw.curriculum.map((mod) => {
      let parsed = mod;
      if (typeof parsed === "string") parsed = tryParseJSON(parsed) ?? parsed;
      if (typeof parsed === "string") return { week: "", title: parsed, topics: [] };
      parsed.topics = tryParseJSON(parsed.topics) ?? parsed.topics ?? [];
      parsed.topics = ensureArray(parsed.topics).map((t) => {
        if (typeof t === "string") return t;
        const cm = charMapToString(t);
        return typeof cm === "string" ? cm : String(t);
      });
      return { week: parsed.week ?? "", title: parsed.title ?? "", topics: parsed.topics };
    });

    // Coerce numeric fields
    if (raw.price !== undefined) raw.price = Number(raw.price) || 0;
    if (raw.rating !== undefined) raw.rating = Number(raw.rating) || 0;
    if (raw.students !== undefined) raw.students = String(raw.students);

    // ✅ Handle image upload using streamifier
    let imageUrl = "";
    if (req.files?.image) {
      const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;

      if (!imageFile.mimetype?.startsWith?.("image/")) {
        return res.status(400).json({ message: "Invalid file type. Please upload an image." });
      }

      try {
        imageUrl = await uploadImage(imageFile);
        console.log("✅ Uploaded image URL:", imageUrl);
      } catch (uErr) {
        console.error("❌ uploadImage failed:", uErr);
        return res.status(500).json({ message: "Image upload failed", error: uErr.message });
      }
    } else if (raw.image_url) {
      imageUrl = raw.image_url;
    }

    // Construct final course object — ensure we pass proper arrays/objects, not strings
    const courseData = {
      ...raw,
      image: imageUrl || raw.image || "",
      whatYouLearn: raw.whatYouLearn,
      careerOutcomes: raw.careerOutcomes,
      certifications: raw.certifications,
      curriculum: raw.curriculum,
      skills: raw.skills,
    };

    console.log("✅ Normalized courseData preview:", {
      whatYouLearn: courseData.whatYouLearn?.slice?.(0, 3),
      careerOutcomes: courseData.careerOutcomes?.slice?.(0, 3),
      certifications: courseData.certifications?.slice?.(0, 3),
      curriculum: courseData.curriculum?.slice?.(0, 3),
    });

    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: "✅ Course created successfully.",
      course: savedCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};



// READ ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// READ ONE COURSE BY ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// UPDATE COURSE
// export const updateCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) return res.status(400).json({ message: "Missing course id in params" });
//
//     console.log("📝 Update body:", req.body);
//     console.log("📸 Update files keys:", Object.keys(req.files || {}));
//
//     // copy body and parse stringified fields
//     const raw = { ...req.body };
//
//     raw.skills = tryParseJSON(raw.skills) ?? [];
//     raw.careerOutcomes = tryParseJSON(raw.careerOutcomes) ?? [];
//     raw.curriculum = tryParseJSON(raw.curriculum) ?? [];
//
//     // coerce numbers
//     if (raw.price !== undefined) raw.price = Number(raw.price) || 0;
//     if (raw.rating !== undefined) raw.rating = Number(raw.rating) || 0;
//     if (raw.students !== undefined) raw.students = Number(raw.students) || 0;
//
//     // Handle image replacement if provided
//     let imageUrl = "";
//     if (req.files?.image) {
//       const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
//       if (!imageFile.mimetype?.startsWith?.("image/")) {
//         return res.status(400).json({ message: "Invalid file type. Please upload an image." });
//       }
//       try {
//         imageUrl = await uploadImage(imageFile.tempFilePath);
//         console.log("✅ uploaded image url (update):", imageUrl);
//       } catch (uErr) {
//         console.error("❌ uploadImage failed (update):", uErr);
//         return res.status(500).json({ message: "Image upload failed", error: uErr.message });
//       }
//     } else if (raw.image_url) {
//       imageUrl = raw.image_url;
//     }
//
//     // Build final update object
//     const updatePayload = {
//       ...raw,
//     };
//
//     if (imageUrl) updatePayload.image = imageUrl;
//
//     // Remove image_url if present so schema doesn't get unexpected field
//     if (updatePayload.image_url) delete updatePayload.image_url;
//
//     // Perform update with validators
//     const updatedCourse = await Course.findByIdAndUpdate(id, updatePayload, {
//       new: true,
//       runValidators: true,
//     });
//
//     if (!updatedCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }
//
//     res.status(200).json({
//       message: "Course updated successfully",
//       course: updatedCourse,
//     });
//   } catch (error) {
//     console.error("❌ Error updating course:", error);
//     res.status(500).json({ message: "Error updating course", error: error.message });
//   }
// };

export const updateCourse = async (req, res) => {
  try {
    const raw = { ...req.body };

    // parse & normalize same as create
    raw.skills = tryParseJSON(raw.skills) ?? [];
    raw.whatYouLearn = tryParseJSON(raw.whatYouLearn) ?? [];
    raw.careerOutcomes = tryParseJSON(raw.careerOutcomes) ?? [];
    raw.certifications = tryParseJSON(raw.certifications) ?? [];
    raw.curriculum = tryParseJSON(raw.curriculum) ?? [];

    raw.skills = ensureArray(raw.skills);
    raw.whatYouLearn = ensureArray(raw.whatYouLearn);
    raw.careerOutcomes = ensureArray(raw.careerOutcomes);
    raw.certifications = ensureArray(raw.certifications);
    raw.curriculum = ensureArray(raw.curriculum);

    raw.whatYouLearn = raw.whatYouLearn.map(normalizeItem);
    // normalize other arrays as in createCourse...
    // handle image upload if any...
    const updatePayload = {
      title: raw.title,
      category: raw.category,
      duration: raw.duration,
      price: raw.price !== undefined ? Number(raw.price) : undefined,
      description: raw.description,
      skills: raw.skills,
      whatYouLearn: raw.whatYouLearn,
      careerOutcomes: raw.careerOutcomes,
      certifications: raw.certifications,
      curriculum: raw.curriculum,
      image: raw.image || raw.image_url,
      rating: raw.rating !== undefined ? Number(raw.rating) : undefined,
    };

    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    const updated = await Course.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Course not found" });
    return res.json({ message: "Course updated", course: updated });
  } catch (err) {
    console.error("❌ Error updating course:", err);
    return res.status(500).json({ message: "Error updating course", error: err.message });
  }
};

// DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};
