import React from "react";

export default function CourseCard({
  course,
  onEdit,
  onDelete,
  onEnroll,
  onLeave,
  role,
}) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p className="desc">{course.description}</p>
      <p className="meta">Teacher: {course.teacherName}</p>
      <p className="meta">Students enrolled: {course.students?.length || 0}</p>

      {role === "teacher" && (
        <div className="controls">
          <button onClick={() => onEdit(course)}>Edit</button>
          <button className="danger" onClick={() => onDelete(course._id)}>
            Delete
          </button>
        </div>
      )}

      {role === "student" && (
        <div className="controls">
          <button onClick={() => onEnroll(course)}>Enroll</button>
          <button className="danger" onClick={() => onLeave(course)}>
            Leave
          </button>
        </div>
      )}
    </div>
  );
}
