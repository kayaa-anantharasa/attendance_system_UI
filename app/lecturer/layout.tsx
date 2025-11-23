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

export default function LecturerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

 const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/lecturer/dashboard", icon: <FiHome /> },
  { name: "Sessions", path: "/lecturer/attendance", icon: <FiBook /> }
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
          {collapsed ? "AD" : "Lecturer Panel"}
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
          <h1 className="text-xl font-semibold">Lecturer Dashboard</h1>
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
