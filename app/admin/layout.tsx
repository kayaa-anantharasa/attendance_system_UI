"use client";

import { JSX, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiLogOut,
  FiHome,
  FiUsers,
  FiSettings,
  FiBook,
  FiLayers,
  FiMapPin,
  FiGrid,
} from "react-icons/fi";

interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

 const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },

  { name: "Users", path: "/admin/users", icon: <FiUsers /> },

  // Departments
  { name: "Departments", path: "/admin/department", icon: <FiGrid /> },

  // Courses
  { name: "Courses", path: "/admin/course", icon: <FiLayers /> },

  // Subjects
  { name: "Subjects", path: "/admin/subject", icon: <FiBook /> },

  // Locations
  { name: "Locations", path: "/admin/location", icon: <FiMapPin /> },

  { name: "Manage", path: "/admin/manage", icon: <FiSettings /> },
  { name: "Equipment", path: "/admin/equipment", icon: <FiSettings /> },
];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4 text-xl font-bold">
          {collapsed ? "AD" : "Admin Panel"}
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-300 hover:text-white">
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center gap-4 py-3 px-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="flex items-center gap-2 text-blue px-4 py-2 rounded"
          >
            <FiLogOut className="text-red-blue" /> 
          </button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
