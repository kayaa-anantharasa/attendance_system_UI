import React, { useState } from "react";
import BarcodeReader from "react-barcode-reader";

export default function Attendance({ sessionId, lecturerId }) {
  const [message, setMessage] = useState("");

  const handleScan = async (barcode) => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: barcode, session_id: sessionId, scanned_by: lecturerId }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error recording attendance");
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage("Scanner error");
  };

  return (
    <div>
      <h2>Scan Student Barcode</h2>
      <BarcodeReader onError={handleError} onScan={handleScan} />
      {message && <p>{message}</p>}
    </div>
  );
}
