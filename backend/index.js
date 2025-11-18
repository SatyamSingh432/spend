const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Course = require("./models/Course");

const app = express();
app.use(cors());
app.use(express.json());
const MONGO =
  process.env.MONGO_URI || "mongodb://localhost:27017/student-teacher-app";

mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// --- Routes ---

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a course (teacher)
app.post("/api/courses", async (req, res) => {
  try {
    const { title, description, teacherName } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const course = new Course({ title, description, teacherName });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Edit a course (teacher)
app.put("/api/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacherName } = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.teacherName = teacherName ?? course.teacherName;
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a course (teacher)
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Student enroll in course
app.post("/api/courses/:id/enroll", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name) return res.status(400).json({ error: "Student name required" });
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // avoid duplicate by email if provided
    if (email && course.students.some((s) => s.email === email)) {
      return res.status(400).json({ error: "Already enrolled" });
    }

    course.students.push({ name, email });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Student leave course
app.post("/api/courses/:id/leave", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (!email)
      return res.status(400).json({ error: "Student email required to leave" });

    course.students = course.students.filter((s) => s.email !== email);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server listening on port", PORT));
