'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Equipment {
    name: string;
  id: number;
  type: string;
  total_qty: number;
  available_qty: number;
}

interface Request {
  id: number;
  equipment_id: number;
  user_id: number;
  status: string;
}

export default function EquipmentDashboard() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<number>(0);
 useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
  }, []); // runs only on client
    const [user, setUser] = useState<{ id: number; name: string }>({ id: 0, name: "" });

  const fetchEquipment = async () => {
    const res = await axios.get("http://localhost:5000/api/equipment");
    setEquipmentList(res.data);
  };

  const fetchRequests = async () => {
    const res = await axios.get(`http://localhost:5000/api/equipment/request`);
    setRequests(res.data);
  };

  const handleRequest = async () => {
    if (!selectedEquipment) return alert("Select equipment");
    await axios.post("http://localhost:5000/api/equipment/request", {
      equipment_id: selectedEquipment,
      user_id: user.id,
    });
    alert("Request submitted!");
    fetchRequests();
  };

  useEffect(() => {
    fetchEquipment();
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lab Equipment</h2>
      <select
        className="border p-2 mb-2"
        value={selectedEquipment}
        onChange={e => setSelectedEquipment(Number(e.target.value))}
      >
        <option value={0}>Select Equipment</option>
        {equipmentList.map(e => (
          <option key={e.id} value={e.id}>
            {e.name} (Available: {e.available_qty})
          </option>
        ))}
      </select>
      <button onClick={handleRequest} className="px-3 py-1 bg-blue-600 text-white rounded">
        Request Equipment
      </button>

      <h3 className="mt-6 font-semibold">Requests</h3>
      <table className="w-full border mt-2 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Equipment</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
     <tbody>
  {requests.map(r => {
    const eq = equipmentList.find(e => e.id === r.equipment_id);
    return (
      <tr key={r.id}>
        <td className="border p-2">{eq ? eq.name : "Unknown"}</td>
        <td className="border p-2 font-semibold">{r.status}</td>
      </tr>
    );
  })}
</tbody>

      </table>
    </div>
  );
}
