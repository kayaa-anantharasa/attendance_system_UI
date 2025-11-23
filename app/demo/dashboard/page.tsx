'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { QrCode, Calendar, ClipboardCheck, MonitorPlay } from "lucide-react";

export default function DemoDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      try {
        const res = await axios.get(`http://localhost:5000/api/assistant/stats/${user.id}`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assistant Dashboard</h1>
        <p className="text-gray-500">Manage lab sessions and attendance.</p>
      </div>

      {/* --- KEY METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500 flex items-center">
          <div className="p-3 bg-indigo-50 rounded-full mr-4 text-indigo-600">
            <MonitorPlay />
          </div>
          <div>
            <p className="text-sm text-gray-500">My Total Sessions</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalSessions}</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-full mr-4 text-emerald-600">
            <ClipboardCheck />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students Scanned Today</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.scannedToday}</h3>
          </div>
        </div>

        {/* Metric 3: Quick Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-lg mb-2">Ready to start?</h3>
            <button 
              onClick={() => window.location.href = '/demo/attendace'} // Point to your scanner page
              className="bg-white text-indigo-700 px-6 py-2 rounded-full font-bold shadow hover:bg-gray-100 transition flex items-center"
            >
              <QrCode className="w-4 h-4 mr-2" /> Scan Attendance
            </button>
        </div>
      </div>

      {/* --- UPCOMING SCHEDULE --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-500" /> Upcoming Sessions
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-3">Subject</th>
                <th className="p-3">Location</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {stats.upcomingSessions.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400">No upcoming sessions found.</td></tr>
              ) : (
                stats.upcomingSessions.map((sess: any) => (
                  <tr key={sess.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-medium">{sess.subject_name}</td>
                    <td className="p-3">{sess.location_name}</td>
                    <td className="p-3">
                        {sess.start_time} <br/>
                        <span className="text-xs text-gray-400">
                            {new Date().toDateString() === new Date(sess.date).toDateString() 
                                ? "Today" 
                                : new Date(sess.date).toLocaleDateString()}
                        </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => window.location.href = '/demo/sessions'}
                        className="text-indigo-600 hover:underline text-xs font-bold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}