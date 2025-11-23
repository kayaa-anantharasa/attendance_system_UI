"use client";

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
  status?: string | null;
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

        // We use the existing backend route
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

  // --- Helper 1: Format Date for Header ---
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    // Example: "Friday, November 22, 2025"
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // --- Helper 2: Format Time (Remove seconds if needed) ---
  const formatTime = (timeStr: string) => {
    // Assumes "HH:MM:SS" format, slices to "HH:MM"
    return timeStr.slice(0, 5); 
  };

  // --- Helper 3: Group Sessions by Date ---
  const groupSessionsByDate = (sessions: Session[]) => {
    const groups: { [key: string]: Session[] } = {};

    sessions.forEach((session) => {
      // Create a standardized key (YYYY-MM-DD) or use the raw date string
      // Assuming session.date comes as ISO string or YYYY-MM-DD
      const dateKey = session.date; 
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Sessions</h2>

      {loading ? (
        <p className="text-gray-500">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No sessions scheduled.</p>
      ) : (
        <div className="space-y-8">
          {/* Loop through each Date Group */}
          {Object.keys(groupedSessions).map((dateKey) => (
            <div key={dateKey} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              
              {/* DATE HEADER */}
              <div className="bg-blue-600 text-white p-3 font-bold text-lg">
                {formatDateHeader(dateKey)}
              </div>

              {/* SESSIONS TABLE FOR THIS DATE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="p-3 border-b">Time</th>
                      <th className="p-3 border-b">Subject</th>
                      <th className="p-3 border-b">Lecturer</th>
                      <th className="p-3 border-b">Assistant</th>
                      <th className="p-3 border-b text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {groupedSessions[dateKey].map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 border-b last:border-b-0">
                        <td className="p-3 font-medium whitespace-nowrap">
                          {formatTime(s.start_time)} - {formatTime(s.end_time)}
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{s.subject_name}</div>
                          <div className="text-xs text-gray-500">{s.subject_code}</div>
                        </td>
                        <td className="p-3">{s.lecturer_name}</td>
                        <td className="p-3">{s.assistant_name || <span className="text-gray-400 italic">None</span>}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            s.status === 'completed' ? 'bg-green-100 text-green-800' :
                            s.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {s.status ? s.status.toUpperCase() : 'SCHEDULED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}