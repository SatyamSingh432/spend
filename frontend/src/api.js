const API_BASE = "http://localhost:8000/api";

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  return res.json();
}

export async function createCourse(payload) {
  const res = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateCourse(id, payload) {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
  return res.json();
}

export async function enrollCourse(id, payload) {
  const res = await fetch(`${API_BASE}/courses/${id}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function leaveCourse(id, payload) {
  const res = await fetch(`${API_BASE}/courses/${id}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
