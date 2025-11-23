"use client"; // ✅ Must be at the very top

import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type of a session
interface Session {
  id: number;
  subject_name: string;
  subject_code: string;
  date: string;
  start_time: string;
  end_time: string;
  lecturer_name: string;
  assistant_name?: string | null;
}

export default function StudentSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userJSON = localStorage.getItem("user");
        if (!userJSON) {
          alert("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userJSON);
        if (!user.id) {
          alert("Invalid user data");
          setLoading(false);
          return;
        }

        const studentId = user.id;

        const res = await axios.get<Session[]>(
          `http://localhost:5000/api/student/${studentId}/sessions`
        );

        setSessions(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch sessions");
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Sessions</h2>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Start Time</th>
                <th className="border p-2">End Time</th>
                <th className="border p-2">Lecturer</th>
                <th className="border p-2">Assistant</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: Session) => (
                <tr key={s.id}>
                  <td className="border p-2">{s.subject_name}</td>
                  <td className="border p-2">{s.subject_code}</td>
                  <td className="border p-2">{formatDate(s.date)}</td>
                  <td className="border p-2">{s.start_time}</td>
                  <td className="border p-2">{s.end_time}</td>
                  <td className="border p-2">{s.lecturer_name}</td>
                  <td className="border p-2">{s.assistant_name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
