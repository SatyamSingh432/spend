const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    teacherName: { type: String, default: "Unknown" },
    students: [
      {
        name: String,
        email: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
