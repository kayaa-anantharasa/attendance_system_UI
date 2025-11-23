import { useState, useEffect } from "react";
import axios from "axios";

export default function LocationForm({ editing, departments, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    location_type: "",
    capacity: "",
    availability: "",
    department_id: "",
  });

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleSubmit = async () => {
    if (editing) {
      await axios.put(`http://localhost:5000/api/locations/${editing.id}`, form);
    } else {
      await axios.post("http://localhost:5000/api/locations/add", form);
    }
    onSaved();
  };

  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Edit Location" : "Add Location"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Location Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            placeholder="Location Type"
            value={form.location_type}
            onChange={(e) =>
              setForm({ ...form, location_type: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={form.availability}
            onChange={(e) =>
              setForm({ ...form, availability: e.target.value })
            }
          >
            <option value="">Select Availability</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>

          <select
            className="border p-2 rounded"
            value={form.department_id}
            onChange={(e) =>
              setForm({ ...form, department_id: e.target.value })
            }
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-5 gap-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            {editing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
