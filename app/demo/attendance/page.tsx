'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Define the types
interface Session {
  id: number;
  subject_name: string;
  subject_code: string;
  date: string;
  start_time: string;
  end_time: string;
  lecturer_name: string;
  assistant_name: string | null;
}

interface Attendance {
  session_id: number;
  status: string;
  scan_time: string;
}

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const studentId = user.id;

        // Fetch sessions
        const sessionsRes = await axios.get<Session[]>(
          `http://localhost:5000/api/student/${studentId}/sessions`
        );

        // Fetch attendance
        const attendanceRes = await axios.get<Attendance[]>(
          `http://localhost:5000/api/student/${studentId}/attendance`
        );

        setSessions(sessionsRes.data);
        setAttendance(attendanceRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // ✅ Fix: pass sessionId to the function
  const getAttendanceStatus = (sessionId: number) => {
    const record = attendance.find(a => a.session_id === sessionId);
    return record ? record.status : "Not Marked";
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Sessions & Attendance</h2>

      {sessions.length === 0 ? (
        <p>No sessions available.</p>
      ) : (
        <table className="border-collapse border w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Code</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
              <th className="border p-2">Lecturer</th>
              <th className="border p-2">Assistant</th>
              <th className="border p-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.subject_name}</td>
                <td className="border p-2">{s.subject_code}</td>
                <td className="border p-2">{s.date}</td>
                <td className="border p-2">{s.start_time}</td>
                <td className="border p-2">{s.end_time}</td>
                <td className="border p-2">{s.lecturer_name}</td>
                <td className="border p-2">{s.assistant_name || "-"}</td>
                <td
                  className={`border p-2 font-semibold ${
                    getAttendanceStatus(s.id) === "present"
                      ? "text-green-600"
                      : getAttendanceStatus(s.id) === "absent"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {getAttendanceStatus(s.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
