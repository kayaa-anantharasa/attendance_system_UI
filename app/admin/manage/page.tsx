'use client';
import { useEffect, useState } from "react";
import axios from "axios";

// --- Interfaces ---
interface Department {
  id: number;
  name: string;
}

interface Lab {
  id: number;
  name: string;
  location: string;
  capacity: number;
  department_id: number;
}

interface Equipment {
  id: number;
  name: string;
  type: string;
  total_qty: number;
  available_qty: number;
  location: string;
  description: string;
  image_url: string | null;
  department_id: number;
}

export default function ManageLabsEquipment() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // --- Modal States ---
  const [showLabModal, setShowLabModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  
  // Track if we are editing (stores ID) or adding (null)
  const [editingLabId, setEditingLabId] = useState<number | null>(null);
  const [editingEquipId, setEditingEquipId] = useState<number | null>(null);

  // --- Form States ---
  const [labForm, setLabForm] = useState({ 
    name: "", location: "", capacity: 0, department_id: "" 
  });

  const [equipForm, setEquipForm] = useState({
    name: "", type: "", total_qty: 0, available_qty: 0, 
    location: "", description: "", department_id: ""
  });

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      const [l, e, d] = await Promise.all([
        axios.get("http://localhost:5000/api/manage/labs"),
        axios.get("http://localhost:5000/api/manage/equipment"),
        axios.get("http://localhost:5000/api/departments") // Ensure this endpoint exists
      ]);
      setLabs(l.data);
      setEquipment(e.data);
      setDepartments(d.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  // ==================== LAB FUNCTIONS ====================

  const openAddLab = () => {
    setEditingLabId(null);
    setLabForm({ name: "", location: "", capacity: 0, department_id: "" });
    setShowLabModal(true);
  };

  const openEditLab = (lab: Lab) => {
    setEditingLabId(lab.id);
    setLabForm({
      name: lab.name,
      location: lab.location,
      capacity: lab.capacity,
      department_id: lab.department_id.toString()
    });
    setShowLabModal(true);
  };

  const handleSaveLab = async () => {
    if (!labForm.department_id) return alert("Select a department");
    
    try {
      if (editingLabId) {
        // UPDATE (PUT)
        await axios.put(`http://localhost:5000/api/manage/labs/${editingLabId}`, labForm);
        alert("Lab updated successfully");
      } else {
        // ADD (POST)
        await axios.post("http://localhost:5000/api/manage/labs", labForm);
        alert("Lab added successfully");
      }
      setShowLabModal(false);
      fetchData(); // Refresh table
    } catch (error: any) {
      alert("Error saving lab: " + error.message);
    }
  };

  const handleDeleteLab = async (id: number) => {
    if (!confirm("Delete this lab?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/manage/labs/${id}`);
      fetchData();
    } catch (error) { console.error(error); }
  };

  // ==================== EQUIPMENT FUNCTIONS ====================

  const openAddEquip = () => {
    setEditingEquipId(null);
    setEquipForm({ name: "", type: "", total_qty: 0, available_qty: 0, location: "", description: "", department_id: "" });
    setShowEquipModal(true);
  };

  const openEditEquip = (eq: Equipment) => {
    setEditingEquipId(eq.id);
    setEquipForm({
      name: eq.name,
      type: eq.type,
      total_qty: eq.total_qty,
      available_qty: eq.available_qty,
      location: eq.location,
      description: eq.description,
      department_id: eq.department_id.toString()
    });
    setShowEquipModal(true);
  };

  const handleSaveEquip = async () => {
    if (!equipForm.department_id) return alert("Select a department");

    // Prepare payload (sending image_url as null)
    const payload = { ...equipForm, image_url: null };

    try {
      if (editingEquipId) {
        // UPDATE (PUT)
        await axios.put(`http://localhost:5000/api/manage/equipment/${editingEquipId}`, payload);
        alert("Equipment updated successfully");
      } else {
        // ADD (POST)
        await axios.post("http://localhost:5000/api/manage/equipment", payload);
        alert("Equipment added successfully");
      }
      setShowEquipModal(false);
      fetchData();
    } catch (error: any) {
      alert("Error saving equipment: " + error.message);
    }
  };

  const handleDeleteEquip = async (id: number) => {
    if (!confirm("Delete this equipment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/manage/equipment/${id}`);
      fetchData();
    } catch (error) { console.error(error); }
  };

  // ==================== RENDER ====================

  return (
    <div className="p-6 relative">
      
      {/* --- LABS SECTION --- */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Labs</h2>
        <button onClick={openAddLab} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          + Add New Lab
        </button>
      </div>

      <table className="border w-full mb-8 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Location</th>
            <th className="border p-2 text-left">Capacity</th>
            <th className="border p-2 text-left">Dept ID</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {labs.map(l => (
            <tr key={l.id} className="hover:bg-gray-50">
              <td className="border p-2">{l.name}</td>
              <td className="border p-2">{l.location}</td>
              <td className="border p-2">{l.capacity}</td>
              <td className="border p-2">{l.department_id}</td>
              <td className="border p-2 text-center space-x-2">
                <button onClick={() => openEditLab(l)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                <button onClick={() => handleDeleteLab(l.id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- EQUIPMENT SECTION --- */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Equipment</h2>
        <button onClick={openAddEquip} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          + Add New Equipment
        </button>
      </div>

      <table className="border w-full shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Type</th>
            <th className="border p-2 text-left">Total / Avail</th>
            <th className="border p-2 text-left">Location</th>
            <th className="border p-2 text-left">Dept ID</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(e => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="border p-2">{e.name}</td>
              <td className="border p-2">{e.type}</td>
              <td className="border p-2">{e.total_qty} / {e.available_qty}</td>
              <td className="border p-2">{e.location}</td>
              <td className="border p-2">{e.department_id}</td>
              <td className="border p-2 text-center space-x-2">
                <button onClick={() => openEditEquip(e)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                <button onClick={() => handleDeleteEquip(e.id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ==================== LAB MODAL ==================== */}
      {showLabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">{editingLabId ? "Edit Lab" : "Add New Lab"}</h3>
            <div className="flex flex-col gap-3">
              <input 
                placeholder="Lab Name" className="border p-2 rounded"
                value={labForm.name} onChange={e => setLabForm({...labForm, name: e.target.value})}
              />
              <input 
                placeholder="Location" className="border p-2 rounded"
                value={labForm.location} onChange={e => setLabForm({...labForm, location: e.target.value})}
              />
               <label className="text-xs text-gray-500">Capacity</label>
              <input 
                type="number" placeholder="Capacity" className="border p-2 rounded"
                value={labForm.capacity} onChange={e => setLabForm({...labForm, capacity: Number(e.target.value)})}
              />
              <select 
                className="border p-2 rounded"
                value={labForm.department_id} onChange={e => setLabForm({...labForm, department_id: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowLabModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleSaveLab} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  {editingLabId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EQUIPMENT MODAL ==================== */}
      {showEquipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{editingEquipId ? "Edit Equipment" : "Add New Equipment"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="Name" className="border p-2 rounded col-span-2"
                value={equipForm.name} onChange={e => setEquipForm({...equipForm, name: e.target.value})}
              />
              <input 
                placeholder="Type" className="border p-2 rounded"
                value={equipForm.type} onChange={e => setEquipForm({...equipForm, type: e.target.value})}
              />
              <input 
                placeholder="Location" className="border p-2 rounded"
                value={equipForm.location} onChange={e => setEquipForm({...equipForm, location: e.target.value})}
              />
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Total Qty</label>
                <input 
                  type="number" className="border p-2 rounded w-full"
                  value={equipForm.total_qty} onChange={e => setEquipForm({...equipForm, total_qty: Number(e.target.value)})}
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Available Qty</label>
                <input 
                  type="number" className="border p-2 rounded w-full"
                  value={equipForm.available_qty} onChange={e => setEquipForm({...equipForm, available_qty: Number(e.target.value)})}
                />
              </div>
              
              <textarea 
                placeholder="Description" className="border p-2 rounded col-span-2"
                value={equipForm.description} onChange={e => setEquipForm({...equipForm, description: e.target.value})}
              />

              <select 
                className="border p-2 rounded col-span-2"
                value={equipForm.department_id} onChange={e => setEquipForm({...equipForm, department_id: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button onClick={() => setShowEquipModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleSaveEquip} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  {editingEquipId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}