'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- Types ---
interface Lab { id: number; name: string; capacity: number; }
interface Equipment { id: number; name: string; type: string; available_qty: number; }
interface LabBooking { id: number; lab_name: string; session_date: string; start_time: string; end_time: string; status: string; }
interface EquipRequest { id: number; equip_name: string; qty: number; status: string; request_date: string; }

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Data State
  const [labs, setLabs] = useState<Lab[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [myLabBookings, setMyLabBookings] = useState<LabBooking[]>([]);
  const [myEquipRequests, setMyEquipRequests] = useState<EquipRequest[]>([]);

  // Modal State
  const [showLabModal, setShowLabModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);

  // Form State
  const [labForm, setLabForm] = useState({ lab_id: "", date: "", start: "", end: "" });
  const [equipForm, setEquipForm] = useState({ equip_id: "", qty: 1,request_date: "" });

  // --- Initial Load ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { router.push("/login"); return; }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    if (userData.department_id) {
      loadData(userData.department_id, userData.id);
    }
  }, []);

  const loadData = async (deptId: number, userId: number) => {
    try {
      const [l, e, lb, er] = await Promise.all([
        axios.get(`http://localhost:5000/api/labs?deptId=${deptId}`),
        axios.get(`http://localhost:5000/api/equipment?deptId=${deptId}`),
        axios.get(`http://localhost:5000/api/labs/my-bookings/${userId}`),
        axios.get(`http://localhost:5000/api/equipment/my-requests/${userId}`)
      ]);
      setLabs(l.data);
      setEquipment(e.data);
      setMyLabBookings(lb.data);
      setMyEquipRequests(er.data);
    } catch (err) { console.error(err); }
  };

  // --- Handlers ---

  const handleBookLab = async () => {
    if (!labForm.lab_id || !labForm.date || !labForm.start || !labForm.end) return alert("Fill all fields");

    try {
      await axios.post("http://localhost:5000/api/labs/book", {
        lab_id: labForm.lab_id,
        user_id: user.id,
        department_id: user.department_id,
        session_date: labForm.date,
        start_time: labForm.start,
        end_time: labForm.end
      });
      alert("Lab booked successfully!");
      setShowLabModal(false);
      loadData(user.department_id, user.id); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

 const handleRequestEquipment = async () => {

    if (!equipForm.equip_id || equipForm.qty <= 0 || !equipForm.request_date) {
      return alert("Please fill all fields (Item, Date, Quantity)");
    }

    try {
      await axios.post("http://localhost:5000/api/equipment/request", {
        equipment_id: equipForm.equip_id,
        user_id: user.id,
        department_id: user.department_id,
        qty: equipForm.qty,
        request_date: equipForm.request_date
      });

      alert("Request sent successfully!");
      setShowEquipModal(false);
      loadData(user.department_id, user.id); 
      
    } catch (err: any) {
     
      const serverMessage = err.response?.data?.message || "Request failed";
      alert(serverMessage);
    }
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-4">
        <div className="space-x-4">
          <button onClick={() => setShowLabModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">+ Book Lab</button>
          <button onClick={() => setShowEquipModal(true)} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">+ Request Equipment</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* --- MY LAB BOOKINGS TABLE --- */}
        <div className="bg-white shadow rounded-lg p-4 border">
          <h2 className="text-lg font-bold mb-3 text-gray-800">My Lab Bookings</h2>
          {myLabBookings.length === 0 ? <p className="text-gray-500">No bookings yet.</p> : (
            <div className="overflow-auto max-h-60">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr><th className="p-2">Lab</th><th className="p-2">Date</th><th className="p-2">Time</th><th className="p-2">Status</th></tr>
                </thead>
                <tbody>
                  {myLabBookings.map(b => (
                    <tr key={b.id} className="border-b">
                      <td className="p-2">{b.lab_name}</td>
                      <td className="p-2">{new Date(b.session_date).toLocaleDateString()}</td>
                      <td className="p-2">{b.start_time.slice(0,5)} - {b.end_time.slice(0,5)}</td>
                      <td className={`p-2 font-bold ${b.status === 'approved' ? 'text-green-600' : b.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {b.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- MY EQUIPMENT REQUESTS TABLE --- */}
        <div className="bg-white shadow rounded-lg p-4 border">
          <h2 className="text-lg font-bold mb-3 text-gray-800">My Equipment Requests</h2>
          {myEquipRequests.length === 0 ? <p className="text-gray-500">No requests yet.</p> : (
            <div className="overflow-auto max-h-60">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr><th className="p-2">Item</th><th className="p-2">Qty</th><th className="p-2">Date</th><th className="p-2">Status</th></tr>
                </thead>
                <tbody>
                  {myEquipRequests.map(r => (
                    <tr key={r.id} className="border-b">
                      <td className="p-2">{r.equip_name}</td>
                      <td className="p-2">{r.qty}</td>
                      <td className="p-2">{new Date(r.request_date).toLocaleDateString()}</td>
                      <td className={`p-2 font-bold ${r.status === 'approved' ? 'text-green-600' : r.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: BOOK LAB --- */}
      {showLabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Book a Lab</h3>
            <div className="space-y-3">
              <select className="w-full border p-2 rounded" onChange={e => setLabForm({...labForm, lab_id: e.target.value})}>
                <option value="">Select Lab</option>
                {labs.map(l => <option key={l.id} value={l.id}>{l.name} (Cap: {l.capacity})</option>)}
              </select>
              <input type="date" className="w-full border p-2 rounded" onChange={e => setLabForm({...labForm, date: e.target.value})} />
              <div className="flex gap-2">
                <input type="time" className="w-full border p-2 rounded" onChange={e => setLabForm({...labForm, start: e.target.value})} />
                <input type="time" className="w-full border p-2 rounded" onChange={e => setLabForm({...labForm, end: e.target.value})} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowLabModal(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleBookLab} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

   {/* --- MODAL: REQUEST EQUIPMENT --- */}
      {showEquipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Request Equipment</h3>
            <div className="space-y-3">
              
              {/* Equipment Dropdown */}
              <select 
                className="w-full border p-2 rounded" 
                value={equipForm.equip_id}
                onChange={e => setEquipForm({...equipForm, equip_id: e.target.value})}
              >
                <option value="">Select Item</option>
                {equipment.map(e => (
                   <option key={e.id} value={e.id} disabled={e.available_qty <= 0}>
                     {e.name} (Available: {e.available_qty}) {e.available_qty <= 0 ? "- Out of Stock" : ""}
                   </option>
                ))}
              </select>
              
              {/* Date Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date Needed:</label>
                <input 
                  type="date" 
                  className="w-full border p-2 rounded"
                  value={equipForm.request_date} 
                  onChange={e => setEquipForm({...equipForm, request_date: e.target.value})}
                />
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantity Needed:</label>
                <input 
                  type="number" 
                  min="1" 
                  className="w-full border p-2 rounded" 
                  value={equipForm.qty} 
                  onChange={e => setEquipForm({...equipForm, qty: Number(e.target.value)})} 
                />
              </div>

            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowEquipModal(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleRequestEquipment} className="px-3 py-1 bg-green-600 text-white rounded">Request</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}