'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Subject {
  id: number;
  subject_id: number;
  subject_name: string;
  subject_code: string;
}

interface Session {
  id: number;
  subject_name: string;
  subject_code: string;
  date: string;
  start_time: string;
  end_time: string;
  location_id: number;
  assistant_name?: string;
}

interface Attendance {
  student_id: string;
  student_name: string;
  status: string;
  scan_time: string;
}

export default function LecturerDashboard() {
  const [lecturerId, setLecturerId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [assistants, setAssistants] = useState<{id: number, name: string}[]>([]);
  const [locations, setLocations] = useState<{id: number, name: string}[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);

  const [assignSubjectId, setAssignSubjectId] = useState<number>(0);
  const [newSession, setNewSession] = useState({
    subject_id: 0,
    assistant_id: 0,
    location_id: 1,
    date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setLecturerId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!lecturerId) return;
    fetchSubjects();
    fetchSessions();
    fetchAssistants();
    fetchLocations();
  }, [lecturerId]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lecturer/subjects/${lecturerId}`);
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lecturer/sessions/${lecturerId}`);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssistants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/lecturer/assistants");
      setAssistants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignSubject = async () => {
    if (!assignSubjectId || !lecturerId) return alert("Select a subject");
    try {
      await axios.post("http://localhost:5000/api/lecturer/assign-subject", {
        lecturer_id: lecturerId,
        subject_id: assignSubjectId
      });
      alert("Subject assigned successfully");
      setAssignSubjectId(0);
      fetchSubjects();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to assign subject");
    }
  };

  const handleAddSession = async () => {
    if (!lecturerId || !newSession.subject_id) return alert("Select a subject");
    try {
      await axios.post("http://localhost:5000/api/lecturer/sessions", {
        ...newSession,
        lecturer_id: lecturerId,
      });
      alert("Session created successfully");
      setShowAddSession(false);
      setNewSession({ subject_id: 0, assistant_id: 0, location_id: 1, date: "", start_time: "", end_time: "" });
      fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create session");
    }
  };

  const handleDeleteSession = async (id: number) => {
    if (!confirm("Delete this session?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/lecturer/sessions/${id}`);
      fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete session");
    }
  };

  const handleViewAttendance = async (sessionId: number) => {
    try {
      const res = await axios.get<Attendance[]>(`http://localhost:5000/api/sessions/${sessionId}/attendance`);
      setAttendanceList(res.data);
      setSelectedSessionId(sessionId);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Assign Subject */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Assign Subject</h2>
        <select
          className="border p-2 mr-2"
          value={assignSubjectId}
          onChange={(e) => setAssignSubjectId(Number(e.target.value))}
        >
          <option value={0}>Select Subject</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {s.subject_name} ({s.subject_code})
            </option>
          ))}
        </select>
        <button onClick={handleAssignSubject} className="px-3 py-1 bg-blue-600 text-white rounded">
          Assign
        </button>
      </div>

      {/* Sessions List */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Sessions</h2>
          <button onClick={() => setShowAddSession(true)} className="px-3 py-1 bg-green-600 text-white rounded">
            Add Session
          </button>
        </div>
        {sessions.length === 0 ? (
          <p>No sessions scheduled yet.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Assistant</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td className="border px-4 py-2">{s.subject_name} ({s.subject_code})</td>
                  <td className="border px-4 py-2">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{s.start_time} - {s.end_time}</td>
                  <td className="border px-4 py-2">{s.assistant_name || "-"}</td>
                  <td className="border px-4 py-2 text-center space-x-1">
                    <button
                      onClick={() => handleViewAttendance(s.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      View Attendance
                    </button>
                    <button
                      onClick={() => handleDeleteSession(s.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Attendance List */}
      {selectedSessionId && (
        <div className="bg-white p-4 shadow rounded mb-6">
          <h3 className="text-xl font-semibold mb-2">Attendance for Session {selectedSessionId}</h3>
          {attendanceList.length === 0 ? (
            <p>No attendance records yet.</p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Student ID</th>
                  <th className="border px-4 py-2">Student Name</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Scan Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map(a => (
                  <tr key={a.student_id}>
                    <td className="border px-4 py-2">{a.student_id}</td>
                    <td className="border px-4 py-2">{a.student_name}</td>
                    <td className={`border px-4 py-2 font-semibold ${
                      a.status === "present" ? "text-green-600" : 
                      a.status === "absent" ? "text-red-600" : "text-gray-600"
                    }`}>{a.status}</td>
                    <td className="border px-4 py-2">{a.scan_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-4">Add Session</h3>

            <select
              className="w-full border p-2 mb-2"
              value={newSession.subject_id}
              onChange={e => setNewSession({ ...newSession, subject_id: Number(e.target.value) })}
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_name} ({s.subject_code})
                </option>
              ))}
            </select>

            <label className="block mb-2">Assistant (optional):</label>
            <select
              className="w-full border p-2 mb-2"
              value={newSession.assistant_id}
              onChange={e => setNewSession({...newSession, assistant_id: Number(e.target.value)})}
            >
              <option value={0}>Select Assistant</option>
              {assistants.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <label className="block mb-2">Location:</label>
            <select
              className="w-full border p-2 mb-2"
              value={newSession.location_id}
              onChange={e => setNewSession({...newSession, location_id: Number(e.target.value)})}
            >
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>

            <label className="block mb-2">Date:</label>
            <input
              type="date"
              className="w-full border p-2 mb-2"
              value={newSession.date}
              onChange={e => setNewSession({...newSession, date: e.target.value})}
            />

            <label className="block mb-2">Start Time:</label>
            <input
              type="time"
              className="w-full border p-2 mb-2"
              value={newSession.start_time}
              onChange={e => setNewSession({...newSession, start_time: e.target.value})}
            />

            <label className="block mb-2">End Time:</label>
            <input
              type="time"
              className="w-full border p-2 mb-4"
              value={newSession.end_time}
              onChange={e => setNewSession({...newSession, end_time: e.target.value})}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddSession(false)} className="px-3 py-1 bg-gray-400 rounded">Cancel</button>
              <button onClick={handleAddSession} className="px-3 py-1 bg-green-600 text-white rounded">Add Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
