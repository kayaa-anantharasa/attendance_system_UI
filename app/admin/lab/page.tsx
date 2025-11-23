'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
  id: number;
  lab_name: string;   
  user_name: string; 
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export default function LabRequestsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/labs/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Approve a booking
  const handleApprove = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/api/labs/booking/${id}/approve`);
      alert("Booking approved");
      fetchBookings();
    } catch (err: any) {
      
      const msg = err.response?.data?.message || "Failed to approve booking";
      alert(msg); 
    }
  };

  const handleReject = async (id: number) => {
    if(!confirm("Reject this booking?")) return;
    try {
      await axios.post(`http://localhost:5000/api/labs/booking/${id}/reject`);
      alert("Booking rejected");
      fetchBookings();
    } catch (err) {
      alert("Failed to reject booking");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lab Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full border-collapse border text-sm shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">User</th>
              <th className="border p-2">Lab Name</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Status</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="border p-2">{b.user_name}</td>
                <td className="border p-2">{b.lab_name}</td>
                <td className="border p-2">{new Date(b.session_date).toLocaleDateString()}</td>
                <td className="border p-2">{b.start_time.slice(0,5)} - {b.end_time.slice(0,5)}</td>
                
                <td className={`border p-2 font-semibold ${
                  b.status === "approved" ? "text-green-600" :
                  b.status === "rejected" ? "text-red-600" :
                  "text-yellow-600"
                }`}>
                  {b.status.toUpperCase()}
                </td>
                
                <td className="border p-2 flex justify-center gap-2">
                  {b.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(b.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">Decided</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}