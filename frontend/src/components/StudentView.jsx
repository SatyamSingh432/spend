import React from "react";
import CourseCard from "./CourseCard";

export default function StudentView({ courses, onEnroll, onLeave }) {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="grid">
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            role="student"
            onEnroll={onEnroll}
            onLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );
}
