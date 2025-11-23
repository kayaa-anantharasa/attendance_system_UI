'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { BookOpen, Calendar, Users, PlusCircle, ArrowRight } from "lucide-react"; // Icons

// Interfaces
interface DashboardStats {
  totalSubjects: number;
  totalSessions: number;
  chartData: { subject_code: string; attendance_count: number }[];
  upcomingSessions: { date: string; start_time: string; subject_name: string }[];
}

export default function LecturerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    totalSessions: 0,
    chartData: [],
    upcomingSessions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      try {
        const res = await axios.get(`http://localhost:5000/api/lecturer/dashboard-stats/${user.id}`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- UI Components ---
  
  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Lecturer Dashboard</h1>
        <p className="text-gray-500">Welcome back, here is your daily overview.</p>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Subjects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <BookOpen className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned Subjects</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalSubjects}</h3>
          </div>
        </div>

        {/* Card 2: Sessions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full mr-4">
            <Calendar className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalSessions}</h3>
          </div>
        </div>

        {/* Card 3: Students (Approx or Placeholder) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <Users className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Attendance</p>
            {/* Sum of attendance from chart data as a quick stat */}
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.chartData.reduce((acc, curr) => acc + curr.attendance_count, 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: CHART SECTION (Takes up 2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Attendance Overview</h3>
          
          {stats.chartData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="subject_code" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="attendance_count" name="Students Present" radius={[4, 4, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#4F46E5" : "#818CF8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No attendance data available for charts yet.
            </div>
          )}
        </div>

        {/* RIGHT: UPCOMING SESSIONS & ACTIONS (Takes up 1 col) */}
        <div className="space-y-6">
          
          {/* Upcoming List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Upcoming Classes</h3>
            <div className="space-y-4">
              {stats.upcomingSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming classes.</p>
              ) : (
                stats.upcomingSessions.map((sess, idx) => (
                  <div key={idx} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="bg-blue-50 text-blue-600 font-bold p-3 rounded-lg text-xs flex flex-col items-center mr-3 w-14">
                      <span>{new Date(sess.date).getDate()}</span>
                      <span className="uppercase">{new Date(sess.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{sess.subject_name}</h4>
                      <p className="text-xs text-gray-500">{sess.start_time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center">
              View All Schedule <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-md text-white">
            <h3 className="font-bold mb-2">Quick Actions</h3>
            <p className="text-blue-100 text-sm mb-4">Manage your subjects and schedule easily.</p>
            
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href='/lecturer/attendance'} // Update to your route
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg flex items-center text-sm transition-all"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add New Session
              </button>
              <button 
                onClick={() => window.location.href='/lecturer/attendance'} // Update to your route
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg flex items-center text-sm transition-all"
              >
                <BookOpen className="w-4 h-4 mr-2" /> Assign Subject
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}