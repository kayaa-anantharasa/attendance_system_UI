'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Request {
  id: number;
  equipment_id: number;
  name: string;      // Matches 'e.name AS name' from backend
  user_name: string; // Matches 'u.name AS user_name' from backend
  request_date: string;
  qty: number;
  status: string;
}

export default function EquipmentRequestsAdmin() {
  const [requests, setRequests] = useState<Request[]>([]);

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
    fetchRequests();
  }, []);

  // Approve a request
  const handleApprove = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/api/equipment/request/${id}/approve`);
      alert("Request approved");
      fetchRequests();
    } catch (err: any) {
      // Show the validation message from the backend
      const msg = err.response?.data?.message || "Failed to approve request";
      alert(msg); 
    }
  };

  // Reject a request
  const handleReject = async (id: number) => {
    if(!confirm("Are you sure you want to reject this request?")) return;
    
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
        <table className="w-full border-collapse border text-sm shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">User</th>
              <th className="border p-2">Equipment</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border p-2">{r.user_name}</td>
                {/* Use r.name directly from backend response */}
                <td className="border p-2">{r.name}</td> 
                <td className="border p-2">{r.qty}</td>
                <td className="border p-2">
                    {new Date(r.request_date).toLocaleDateString()}
                </td>
                
                <td className={`border p-2 font-bold ${
                  r.status === "approved" ? "text-green-600" :
                  r.status === "rejected" ? "text-red-600" :
                  "text-yellow-600"
                }`}>
                  {r.status.toUpperCase()}
                </td>
                
                <td className="border p-2 flex gap-2">
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {r.status !== "pending" && <span className="text-gray-400 text-xs">Decided</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}