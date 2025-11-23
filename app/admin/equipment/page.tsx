'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Equipment {
  id: number;
  name: string;
  available_qty: number;
}

interface Request {
  id: number;
  equipment_id: number;
  user_id: number;
  status: string;
}

export default function EquipmentRequestsAdmin() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  // Fetch all equipment
  const fetchEquipment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipment");
      setEquipmentList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all equipment requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipment/request");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchRequests();
  }, []);

  // Approve a request
  const handleApprove = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/api/equipment/request/${id}/approve`);
      alert("Request approved");
      fetchRequests();
    } catch (err) {
      alert("Failed to approve request");
      console.error(err);
    }
  };

  // Reject a request
  const handleReject = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/api/equipment/request/${id}/reject`);
      alert("Request rejected");
      fetchRequests();
    } catch (err) {
      alert("Failed to reject request");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Equipment Requests</h2>

      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Equipment</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => {
              const eq = equipmentList.find(e => e.id === r.equipment_id);
              return (
                <tr key={r.id}>
                  <td className="border p-2">{eq ? eq.name : "Unknown"}</td>
                  <td className={`border p-2 font-semibold ${
                    r.status === "approved" ? "text-green-600" :
                    r.status === "rejected" ? "text-red-600" :
                    "text-gray-600"
                  }`}>
                    {r.status}
                  </td>
                  <td className="border p-2 flex gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status !== "pending" && <span>-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
