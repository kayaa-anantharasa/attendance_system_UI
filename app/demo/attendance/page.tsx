"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import QrScanner from "react-qr-barcode-scanner"; 

interface Session {
  id: number;
  subject_name: string;
  subject_code: string;
  date: string;
  start_time: string;
  end_time: string;
  lecturer_name: string;
  status: string; // ✅ Added status field
}

interface Attendance {
  id: number;
  student_id: number;
  student_name: string;
  status: string;
  scanned_by: string;
  scan_time: string;
}

export default function AssistantSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [openSessionId, setOpenSessionId] = useState<number | null>(null);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [scannedData, setScannedData] = useState<string | null>(null);

  // Fetch assistant sessions
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    const fetchSessions = async () => {
      try {
        if (!user.id) return;
        const res = await axios.get<Session[]>(
          `http://localhost:5000/api/assistant/${user.id}/sessions`
        );
        setSessions(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch sessions");
      }
    };

    fetchSessions();
  }, []);

  // Fetch attendance for a session
  const fetchAttendance = async (sessionId: number) => {
    try {
      const res = await axios.get<Attendance[]>(
        `http://localhost:5000/api/assistant/session/${sessionId}`
      );
      setAttendanceList(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    }
  };

  const openModal = (sessionId: number) => {
    setOpenSessionId(sessionId);
    fetchAttendance(sessionId);
    setScannedData(null);
  };

  const markAttendance = async (studentId: string) => {
    if (!openSessionId) return;
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      await axios.post(`http://localhost:5000/api/assistant/attendance`, {
        sessionId: openSessionId,
        studentId,
        scannedBy: user.id,
      });

      setScannedData(null);
      fetchAttendance(openSessionId);
      alert("Attendance marked successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleScan = (data: string | null) => {
    if (!data) return;
    setScannedData(data);

    const match = data.match(/UserID:([^;]+)/);
    if (match && match[1]) {
      const studentId = match[1];
      markAttendance(studentId);
    } else {
      alert("Invalid QR Code format!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Sessions</h2>

      {sessions.length === 0 ? (
        <p>No sessions available.</p>
      ) : (
        <table className="border-collapse border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Code</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Lecturer</th>
              <th className="border p-2">Status</th> 
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className={s.status === 'cancelled' ? "bg-red-50" : ""}>
                <td className="border p-2">{s.subject_name}</td>
                <td className="border p-2">{s.subject_code}</td>
                <td className="border p-2">{new Date(s.date).toLocaleDateString()}</td>
                <td className="border p-2">{s.start_time} - {s.end_time}</td>
                <td className="border p-2">{s.lecturer_name}</td>
                
                {/* Status Column */}
                <td className="border p-2 text-center font-bold">
                  {s.status === 'cancelled' ? (
                    <span className="text-red-600">CANCELLED</span>
                  ) : (
                    <span className="text-green-600">SCHEDULED</span>
                  )}
                </td>

                {/* Actions Column with Disabled Button Logic */}
                <td className="border p-2 text-center">
                  <button
                    disabled={s.status === 'cancelled'} // 👈 Disable logic
                    className={`px-3 py-1 text-white rounded ${
                      s.status === 'cancelled' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => openModal(s.id)}
                  >
                    Take Attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Attendance Modal */}
      {openSessionId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-4">
              Attendance for Session {openSessionId}
            </h3>

            <div className="mb-4">
              <QrScanner
                onUpdate={(err, result) => {
                  if (result) {
                    const scannedText = result.getText();
                    handleScan(scannedText);
                  }
                  if (err) console.error(err);
                }}
                facingMode="environment"
              />

              {scannedData && (
                <p className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                  Scanned Data: {scannedData}
                </p>
              )}
            </div>

            {attendanceList.length === 0 ? (
              <p>No attendance records yet.</p>
            ) : (
              <table className="w-full border-collapse border mb-4 text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Student Name</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((a) => (
                    <tr key={a.id}>
                      <td className="border p-2">{a.student_name}</td>
                      <td className="border p-2 font-semibold text-green-600">
                        {a.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex justify-end">
              <button
                className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-white"
                onClick={() => setOpenSessionId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}