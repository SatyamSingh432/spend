import React, { useState } from "react";
import CourseCard from "./CourseCard";

export default function TeacherView({ courses, onCreate, onEdit, onDelete }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    teacherName: "",
  });

  function submit(e) {
    e.preventDefault();
    if (!form.title) return alert("Title required");
    onCreate(form);
    setForm({ title: "", description: "", teacherName: "" });
  }

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <form className="cards form" onSubmit={submit}>
        <input
          placeholder="Course title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Teacher name"
          value={form.teacherName}
          onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Create Course</button>
      </form>

      <div className="grid">
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            role="teacher"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
