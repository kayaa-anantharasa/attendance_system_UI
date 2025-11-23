"use client";

import { useState, useEffect } from "react";

export default function SessionForm({ refreshSessions }) {
  const [subjects, setSubjects] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const backendUrl = "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, lecRes, assRes] = await Promise.all([
          fetch(`${backendUrl}/subjects`).then(res => res.json()),
          fetch(`${backendUrl}/users?role=lecturer`).then(res => res.json()),
          fetch(`${backendUrl}/users?role=demo`).then(res => res.json()),
        ]);
        setSubjects(subRes);
        setLecturers(lecRes);
        setAssistants(assRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subjectId,
          lecturer_id: lecturerId,
          assistant_id: assistantId,
          location_id: locationId,
          date,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Session added successfully!");
        refreshSessions();
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-96">
      <label>Subject:</label>
      <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
        <option value="">-- Select Subject --</option>
        {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
      </select>

      <label>Lecturer:</label>
      <select value={lecturerId} onChange={e => setLecturerId(e.target.value)} required>
        <option value="">-- Select Lecturer --</option>
        {lecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>

      <label>Demo Assistant (optional):</label>
      <select value={assistantId} onChange={e => setAssistantId(e.target.value)}>
        <option value="">-- None --</option>
        {assistants.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>

      <label>Date:</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

      <label>Start Time:</label>
      <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />

      <label>End Time:</label>
      <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />

      <label>Location ID:</label>
      <input type="number" value={locationId} onChange={e => setLocationId(e.target.value)} required />

      <button type="submit" className="bg-blue-600 text-white px-3 py-1 mt-2 rounded">Add Session</button>
    </form>
  );
}
