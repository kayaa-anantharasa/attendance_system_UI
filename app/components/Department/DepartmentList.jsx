"use client";

import { useEffect, useState } from "react";
import DepartmentForm from "./DepartmentForm";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [editingDept, setEditingDept] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load all departments
  const fetchDepartments = async () => {
    const res = await fetch("http://localhost:5000/api/departments");
    const data = await res.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Delete department
  const deleteDepartment = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    await fetch(`http://localhost:5000/api/departments/${id}`, {
      method: "DELETE",
    });

    fetchDepartments();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Departments</h2>

        <button
          onClick={() => {
            setEditingDept(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Department
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <DepartmentForm
          editingDept={editingDept}
          closeForm={() => setShowForm(false)}
          refreshList={fetchDepartments}
        />
      )}

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Department Name</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id} className="border">
              <td className="p-3 border">{dept.id}</td>
              <td className="p-3 border">{dept.name}</td>

              <td className="p-3 border text-center">
                <button
                  onClick={() => {
                    setEditingDept(dept);
                    setShowForm(true);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteDepartment(dept.id)}
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
