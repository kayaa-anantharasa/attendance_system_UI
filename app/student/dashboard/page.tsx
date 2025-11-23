'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BookOpen, CheckCircle, Clock, QrCode, Calendar, ArrowRight, X } from "lucide-react";
import QRCode from "react-qr-code"; // ✅ 1. Import QR Library

interface DashboardStats {
  enrolledSubjects: number;
  totalAttended: number;
  chartData: { subject_code: string; attendance_count: number }[];
  upcomingSessions: { date: string; start_time: string; subject_name: string }[];
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    enrolledSubjects: 0,
    totalAttended: 0,
    chartData: [],
    upcomingSessions: []
  });
  const [loading, setLoading] = useState(true);

  // ✅ 2. State for Modal and Barcode
  const [showQRModal, setShowQRModal] = useState(false);
  const [userBarcode, setUserBarcode] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      // ✅ 3. Get Barcode from Local Storage
      if (user.barcode) setUserBarcode(user.barcode);
      if (user.name) setUserName(user.name);

      try {
        const res = await axios.get(`http://localhost:5000/api/student/dashboard-stats/${user.id}`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 relative">

      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-500">Track your attendance and schedule.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-semibold text-gray-600">Current Semester</p>
          <p className="text-xs text-gray-400">2025/2026</p>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Card 1: Subjects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transform transition hover:-translate-y-1 hover:shadow-md duration-300">
          <div className="p-3 bg-indigo-100 rounded-full mr-4">
            <BookOpen className="text-indigo-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Enrolled Subjects</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.enrolledSubjects}</h3>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transform transition hover:-translate-y-1 hover:shadow-md duration-300">
          <div className="p-3 bg-emerald-100 rounded-full mr-4">
            <CheckCircle className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Classes Attended</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalAttended}</h3>
          </div>
        </div>

        {/* Card 3: Quick Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transform transition hover:-translate-y-1 hover:shadow-md duration-300">
          <div className="p-3 bg-amber-100 rounded-full mr-4">
            <Clock className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Next Class In</p>
            <h3 className="text-xl font-bold text-gray-800">
              {stats.upcomingSessions.length > 0
                ? stats.upcomingSessions[0].start_time.slice(0, 5)
                : "N/A"}
            </h3>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: ATTENDANCE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
            Attendance Trends
          </h3>

          {stats.chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="subject_code" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="attendance_count" stroke="#10B981" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No attendance history yet.
            </div>
          )}
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="space-y-6">

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">My QR Code</h3>
            <p className="text-emerald-100 text-sm mb-4">Show this to your lecturer or assistant.</p>

            {/* ✅ 4. Button triggers Modal */}
            <button
              onClick={() => setShowQRModal(true)}
              className="w-full bg-white text-teal-700 font-bold py-3 rounded-lg flex items-center justify-center shadow hover:bg-gray-50 transition-colors"
            >
              <QrCode className="w-5 h-5 mr-2" /> View QR Code
            </button>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => window.location.href = '/student/sessions'}
                className="flex-1 bg-emerald-700/50 hover:bg-emerald-700/70 py-2 rounded text-sm text-center transition"
              >
                Schedule
              </button>
              <button
                onClick={() => window.location.href = '/student/booking'}
                className="flex-1 bg-emerald-700/50 hover:bg-emerald-700/70 py-2 rounded text-sm text-center transition"
              >
                Book Lab
              </button>
            </div>
          </div>

          {/* Upcoming Classes List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" /> Upcoming
            </h3>

            <div className="space-y-4">
              {stats.upcomingSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming classes.</p>
              ) : (
                stats.upcomingSessions.map((sess, idx) => (
                  <div key={idx} className="flex gap-3 items-start border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                    <div className="bg-gray-100 rounded-lg p-2 text-center min-w-[50px]">
                      <span className="block text-xs font-bold text-gray-500 uppercase">
                        {new Date(sess.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="block text-lg font-bold text-gray-800">
                        {new Date(sess.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{sess.subject_name}</h4>
                      <p className="text-xs text-gray-500">{sess.start_time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-4 text-xs text-center text-gray-400 hover:text-gray-600 flex items-center justify-center">
              See full schedule <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

        </div>
      </div>

      {/* ✅ 5. QR CODE MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">

            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Student Identity</h3>
              <p className="text-sm text-gray-500">{userName}</p>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
              <div className="p-4 border-4 border-emerald-500 rounded-xl">
                {userBarcode ? (

                  <img
                    src={userBarcode}
                    alt="User QR Code"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="h-48 w-48 flex items-center justify-center text-gray-400 text-sm text-center">
                    No Barcode Found on Profile
                  </div>
                )}
              </div>
            </div>


            <p className="text-center text-xs text-gray-400">
              Scan this code to mark your attendance.
            </p>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full mt-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}