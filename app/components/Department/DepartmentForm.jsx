"use client";

import { useState } from "react";

export default function DepartmentForm({ editingDept, closeForm, refreshList }) {
  const [name, setName] = useState(editingDept ? editingDept.name : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingDept) {
      // UPDATE
      await fetch(`http://localhost:5000/api/departments/${editingDept.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } else {
      // ADD
      await fetch("http://localhost:5000/api/departments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }

    refreshList();
    closeForm();
  };

  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingDept ? "Edit Department" : "Add Department"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Department Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              {editingDept ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
