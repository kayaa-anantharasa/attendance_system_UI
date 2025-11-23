'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Lab {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

interface Booking {
  id: number;
  lab_id: number;
  lab_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
}

export default function LabBooking() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedLab, setSelectedLab] = useState<number>(0);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchLabs = async () => {
    const res = await axios.get("http://localhost:5000/api/labs");
    setLabs(res.data);
  };

  const fetchBookings = async () => {
    const res = await axios.get(`http://localhost:5000/api/labs/bookings/${user.id}`);
    setBookings(res.data);
  };

  const handleBooking = async () => {
    try {
      await axios.post("http://localhost:5000/api/labs/book", {
        lab_id: selectedLab,
        user_id: user.id,
        session_date: date,
        start_time: startTime,
        end_time: endTime,
      });
      alert("Lab booked successfully");
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  useEffect(() => {
    fetchLabs();
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lab Booking</h2>

      <select className="border p-2 mb-2" value={selectedLab} onChange={e => setSelectedLab(Number(e.target.value))}>
        <option value={0}>Select Lab</option>
        {labs.map(l => (
          <option key={l.id} value={l.id}>{l.name} ({l.location})</option>
        ))}
      </select>

      <input type="date" className="border p-2 mb-2" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" className="border p-2 mb-2" value={startTime} onChange={e => setStartTime(e.target.value)} />
      <input type="time" className="border p-2 mb-4" value={endTime} onChange={e => setEndTime(e.target.value)} />

      <button onClick={handleBooking} className="px-3 py-1 bg-green-600 text-white rounded">Book Lab</button>

      <h3 className="mt-6 font-semibold">My Bookings</h3>
      <table className="w-full border mt-2 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Lab</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td className="border p-2">{b.lab_name}</td>
              <td className="border p-2">{b.session_date}</td>
              <td className="border p-2">{b.start_time}</td>
              <td className="border p-2">{b.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
