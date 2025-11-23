"use client";

import { useState } from "react";

export default function CourseForm({
  editingCourse,
  closeForm,
  refreshList,
  departments,
}) {
  const [departmentId, setDepartmentId] = useState(
    editingCourse ? editingCourse.department_id : ""
  );
  const [courseName, setCourseName] = useState(
    editingCourse ? editingCourse.course_name : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      department_id: departmentId,
      course_name: courseName,
    };

    if (editingCourse) {
      await fetch(`http://localhost:5000/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://localhost:5000/api/courses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    refreshList();
    closeForm();
  };

  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingCourse ? "Edit Course" : "Add Course"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Department Dropdown */}
          <label className="block mb-2 font-medium">Select Department</label>
          <select
            className="w-full px-3 py-2 border rounded mb-4"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
          >
            <option value="">-- Select Department --</option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Course Name */}
          <label className="block mb-2 font-medium">Course Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-4"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
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
              {editingCourse ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
