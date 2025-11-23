"use client";

import { useState, useEffect } from "react";

export default function SubjectForm({ editingSubject, closeForm, refreshList }) {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(
    editingSubject ? editingSubject.course_id : ""
  );
  const [subjectName, setSubjectName] = useState(
    editingSubject ? editingSubject.subject_name : ""
  );
  const [subjectCode, setSubjectCode] = useState(
    editingSubject ? editingSubject.subject_code : ""
  );

  useEffect(() => {
    // Fetch courses from backend
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      course_id: courseId,
      subject_name: subjectName,
      subject_code: subjectCode,
    };

    try {
      if (editingSubject) {
        await fetch(`http://localhost:5000/api/subjects/${editingSubject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:5000/api/subjects/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      refreshList();
      closeForm();
    } catch (err) {
      console.error("Failed to save subject:", err);
    }
  };

  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingSubject ? "Edit Subject" : "Add Subject"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Course</label>
          <select
            className="w-full px-3 py-2 border rounded mb-4"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Subject Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-4"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Subject Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-4"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingSubject ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
