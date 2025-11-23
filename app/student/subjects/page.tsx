"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Subject {
  id: number;
  subject_name: string;
  subject_code: string;
}

interface Enrolled {
  id: number;
  subject_name: string;
  subject_code: string;
}

export default function StudentSubjectsPage() {
  const [available, setAvailable] = useState<Subject[]>([]);
  const [enrolled, setEnrolled] = useState<Enrolled[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get studentId from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setStudentId(parsed.id);
      } catch (err) {
        console.error("Invalid localStorage user", err);
      }
    }
  }, []);

  // Fetch subjects when studentId is available
  useEffect(() => {
    if (studentId) {
      fetchAvailable();
      fetchEnrolled();
    }
  }, [studentId]);

  const fetchAvailable = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student-subjects/available/${studentId}`);
      setAvailable(res.data);
    } catch (err) {
      console.error("Fetch available subjects error:", err);
    }
  };

  const fetchEnrolled = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student-subjects/enrolled/${studentId}`);
      setEnrolled(res.data);
    } catch (err) {
      console.error("Fetch enrolled subjects error:", err);
    }
  };

  const toggleSubject = (id: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAddSubjects = async () => {
    if (!studentId || selectedSubjects.length === 0) return alert("Select at least one subject");

    try {
      await axios.post("http://localhost:5000/api/student-subjects/add", {
        student_id: studentId,
        subject_ids: selectedSubjects,
      });
      alert("Subjects added successfully");
      setSelectedSubjects([]);
      setShowModal(false);
      fetchEnrolled();
      fetchAvailable(); // refresh available subjects
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add subjects");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/student-subjects/${id}`);
      fetchEnrolled();
      fetchAvailable(); // refresh available subjects
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enroll Subjects</h1>

      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Add Subjects
      </button>

      {/* Enrolled Subjects */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Enrolled Subjects</h2>
        {enrolled.length === 0 ? (
          <p className="text-gray-500">No subjects enrolled yet.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Code</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolled.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.subject_name}</td>
                  <td className="border px-4 py-2">{item.subject_code}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for selecting subjects */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Select Subjects</h3>

            {available.length === 0 ? (
              <p className="text-gray-500">No subjects available for your course.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto grid grid-cols-1 gap-2">
                {available.map((sub) => (
                  <label key={sub.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={sub.id}
                      checked={selectedSubjects.includes(sub.id)}
                      onChange={() => toggleSubject(sub.id)}
                      className="w-4 h-4"
                    />
                    <span>{sub.subject_name} ({sub.subject_code})</span>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubjects}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
