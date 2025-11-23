"use client";

import { useState, useEffect } from "react";
import SubjectForm from "./SubjectForm";

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSubjects = async () => {
    const res = await fetch("http://localhost:5000/api/subjects");
    const data = await res.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const deleteSubject = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    await fetch(`http://localhost:5000/api/subjects/${id}`, {
      method: "DELETE",
    });

    fetchSubjects();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Subjects</h2>

        <button
          onClick={() => {
            setEditingSubject(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Subject
        </button>
      </div>

      {showForm && (
        <SubjectForm
          editingSubject={editingSubject}
          closeForm={() => setShowForm(false)}
          refreshList={fetchSubjects}
        />
      )}

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Course ID</th>
            <th className="p-3 border">Subject Name</th>
            <th className="p-3 border">Subject Code</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((sub) => (
            <tr key={sub.id} className="border">
              <td className="p-3 border">{sub.id}</td>
              <td className="p-3 border">{sub.course_id}</td>
              <td className="p-3 border">{sub.subject_name}</td>
              <td className="p-3 border">{sub.subject_code}</td>

              <td className="p-3 border text-center">
                <button
                  onClick={() => {
                    setEditingSubject(sub);
                    setShowForm(true);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSubject(sub.id)}
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
