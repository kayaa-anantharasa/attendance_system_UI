"use client";

import { useEffect, useState } from "react";
import CourseForm from "./CourseForm";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]); 
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5000/api/courses");
    const data = await res.json();
    setCourses(data);
  };
 const fetchDepartments = async () => {
    const res = await fetch("http://localhost:5000/api/departments");
    const data = await res.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const deleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE",
    });

    fetchCourses();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>

        <button
          onClick={() => {
            setEditingCourse(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Course
        </button>
      </div>

      {showForm && (
        <CourseForm 
    editingCourse={editingCourse} 
    closeForm={() => setShowForm(false)}
    refreshList={fetchCourses}
    departments={departments}
  />

      )}

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Department ID</th>
            <th className="p-3 border">Course Name</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border">
              <td className="p-3 border">{c.id}</td>
              <td className="p-3 border">{c.department_id}</td>
              <td className="p-3 border">{c.course_name}</td>

              <td className="p-3 border text-center">
                <button
                  onClick={() => {
                    setEditingCourse(c);
                    setShowForm(true);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(c.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
