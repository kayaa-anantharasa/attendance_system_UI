'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Users, Server, ClipboardList, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  // Colors for Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Overview</h1>

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          title="Total Users" 
          value={stats.totalUsers} 
          color="bg-blue-100" 
        />
        <StatCard 
          icon={<Server className="text-purple-600" />} 
          title="Total Equipment" 
          value={stats.totalEquipment} 
          color="bg-purple-100" 
        />
        {/* Actionable Cards (Red/Orange if items pending) */}
        <StatCard 
          icon={<ClipboardList className={stats.pendingLabBookings > 0 ? "text-red-600" : "text-gray-600"} />} 
          title="Pending Lab Bookings" 
          value={stats.pendingLabBookings} 
          color={stats.pendingLabBookings > 0 ? "bg-red-100" : "bg-gray-100"} 
        />
        <StatCard 
          icon={<AlertCircle className={stats.pendingEquipRequests > 0 ? "text-orange-600" : "text-gray-600"} />} 
          title="Pending Equip Requests" 
          value={stats.pendingEquipRequests} 
          color={stats.pendingEquipRequests > 0 ? "bg-orange-100" : "bg-gray-100"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. USER DISTRIBUTION CHART */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-700">System Users</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.userDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="role"
                  label
                >
                  {stats.userDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. RECENT ACTIVITY LOG */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Recent Attendance Scans</h3>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? <p>No recent activity.</p> : 
              stats.recentActivity.map((act: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{act.student_name}</p>
                      <p className="text-xs text-slate-500">Marked {act.status}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(act.scan_time).toLocaleTimeString()}
                  </span>
                </div>
              ))
            }
          </div>
          <button 
            onClick={() => window.location.href = '/admin/reports'} disabled
            className="w-full mt-4 text-sm text-blue-600 hover:underline"
          >
            View Full Logs
          </button>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
      <div className={`p-3 rounded-lg mr-4 ${color} bg-opacity-50`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
}