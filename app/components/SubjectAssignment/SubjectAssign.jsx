"use client";

import { useState, useEffect } from "react";

function SubjectAssignmentDynamic() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [lecturerRole, setLecturerRole] = useState("lecturer");

  const backendUrl = "http://localhost:5000"; // change if your backend port is different

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsRes = await fetch(`${backendUrl}/api/subjects`);
        setSubjects(await subjectsRes.json());

        const studentsRes = await fetch(`${backendUrl}/api/users?role=student`);
        setStudents(await studentsRes.json());

        const lecturersRes = await fetch(`${backendUrl}/api/users?role=lecturer`);
        setLecturers(await lecturersRes.json());
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data from backend.");
      }
    };
    fetchData();
  }, []);

  const enrollStudents = async () => {
    try {
      for (const subjectId of selectedSubjects) {
        const res = await fetch(`${backendUrl}/api/subjects/${subjectId}/enroll-students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentIds: selectedStudents.map(Number) }),
        });
        const data = await res.json();
        if (!data.success) {
          alert(`Enrollment failed for subject ${subjectId}: ${data.message}`);
          return;
        }
      }
      alert("Students enrolled successfully!");
      setSelectedStudents([]);
    } catch (err) {
      console.error(err);
      alert("Error enrolling students.");
    }
  };

  const assignLecturers = async () => {
    try {
      for (const subjectId of selectedSubjects) {
        const res = await fetch(`${backendUrl}/api/subjects/${subjectId}/enroll-lecturers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lecturerIds: selectedLecturers.map(Number), role: lecturerRole }),
        });
        const data = await res.json();
        if (!data.success) {
          alert(`Assignment failed for subject ${subjectId}: ${data.message}`);
          return;
        }
      }
      alert(`${lecturerRole}s assigned successfully!`);
      setSelectedLecturers([]);
    } catch (err) {
      console.error(err);
      alert("Error assigning lecturers/demo.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-bold">Select Subjects</h2>
      <select
        multiple
        value={selectedSubjects}
        onChange={(e) => setSelectedSubjects([...e.target.selectedOptions].map((o) => Number(o.value)))}
        className="border p-2 w-full"
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.subject_name} ({s.subject_code})
          </option>
        ))}
      </select>

      <div>
        <h2 className="text-lg font-bold">Assign Students</h2>
        <select
          multiple
          value={selectedStudents}
          onChange={(e) => setSelectedStudents([...e.target.selectedOptions].map((o) => Number(o.value)))}
          className="border p-2 w-full mb-2"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button onClick={enrollStudents} className="bg-blue-500 text-white px-4 py-2 rounded">
          Enroll Students
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold">Assign Lecturers / Demo</h2>
        <div className="mb-2">
          <label className="mr-2">Role:</label>
          <select
            value={lecturerRole}
            onChange={(e) => setLecturerRole(e.target.value)}
            className="border p-1"
          >
            <option value="lecturer">Lecturer</option>
            <option value="demo">Demo</option>
          </select>
        </div>

        <select
          multiple
          value={selectedLecturers}
          onChange={(e) => setSelectedLecturers([...e.target.selectedOptions].map((o) => Number(o.value)))}
          className="border p-2 w-full mb-2"
        >
          {lecturers.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <button onClick={assignLecturers} className="bg-green-500 text-white px-4 py-2 rounded">
          Assign Lecturers / Demo
        </button>
      </div>
    </div>
  );
}

export default SubjectAssignmentDynamic;
