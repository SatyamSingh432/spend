import React, { useState, useEffect } from "react";
import StudentView from "./components/StudentView";
import TeacherView from "./components/TeacherView";
import * as api from "./api";
import "./App.css";

export default function App() {
  const [role, setRole] = useState("student"); // 'student' or 'teacher'
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.fetchCourses();
        // Ensure we always have an array
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate(payload) {
    try {
      const newCourse = await api.createCourse(payload);
      if (newCourse?.error) return alert(newCourse.error);
      // functional update to avoid stale state
      setCourses((prev) => [...prev, newCourse]);
    } catch (err) {
      console.error("Create course error:", err);
      alert("Failed to create course");
    }
  }

  async function handleEdit(id, payload) {
    try {
      const updatedCourse = await api.updateCourse(id, payload);
      if (updatedCourse?.error) return alert(updatedCourse.error);
      setCourses((prev) => prev.map((c) => (c._id === id ? updatedCourse : c)));
    } catch (err) {
      console.error("Edit course error:", err);
      alert("Failed to edit course");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await api.deleteCourse(id);
      if (res?.error) return alert(res.error);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete course error:", err);
      alert("Failed to delete course");
    }
  }

  async function handleEnroll(course) {
    const rawName = prompt("Your name?");
    const rawEmail = prompt("Your email?");
    const name = rawName ? rawName.trim() : "";
    const email = rawEmail ? rawEmail.trim() : "";

    if (!name || !email) return alert("Name and email are required to enroll.");

    try {
      const res = await api.enrollCourse(course._id, { name, email });
      if (res?.error) return alert(res.error);
      setCourses((prev) => prev.map((c) => (c._id === course._id ? res : c)));
    } catch (err) {
      console.error("Enroll error:", err);
      alert("Failed to enroll");
    }
  }

  async function handleLeave(course) {
    const rawEmail = prompt("Your email to confirm leaving?");
    const email = rawEmail ? rawEmail.trim() : "";
    if (!email) return alert("Email is required to leave.");

    try {
      const res = await api.leaveCourse(course._id, { email });
      if (res?.error) return alert(res.error);
      setCourses((prev) => prev.map((c) => (c._1d === course._id ? res : c)));
      // NOTE: fixed typo in next line if present in your code: should use _id
      setCourses((prev) => prev.map((c) => (c._id === course._id ? res : c)));
    } catch (err) {
      console.error("Leave error:", err);
      alert("Failed to leave");
    }
  }

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="container">
      <nav>
        <h1>Student-Teacher App</h1>
        <div className="role-switcher">
          <button
            onClick={() => setRole("student")}
            className={role === "student" ? "active" : ""}
          >
            Student
          </button>
          <button
            onClick={() => setRole("teacher")}
            className={role === "teacher" ? "active" : ""}
          >
            Teacher
          </button>
        </div>
      </nav>

      {role === "student" ? (
        <StudentView
          courses={courses}
          onEnroll={handleEnroll}
          onLeave={handleLeave}
        />
      ) : (
        <TeacherView
          courses={courses}
          onCreate={handleCreate}
          onEdit={(course) => {
            const title = prompt("New title", course.title);
            if (title === null) return;
            const description = prompt("New description", course.description);
            if (description === null) return;
            const teacherName = prompt("New teacher name", course.teacherName);
            if (teacherName === null) return;
            handleEdit(course._id, { title, description, teacherName });
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
