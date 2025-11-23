"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department_id?: number;
  course_id?: number;
  barcode?: string;
}

interface Department {
  id: number;
  name: string;
}

interface Course {
  id: number;
  department_id: number;
  course_name: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    role: "student",
    department_id: "",
    course_id: "",
  });

  const [token, setToken] = useState<string | null>(null);

  // Load everything
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    fetchDepartments(savedToken);
    fetchUsers(savedToken);
  }, []);

  // When department changes → load courses
  useEffect(() => {
    if (form.department_id && token) {
      fetchCourses(form.department_id);
    }
  }, [form.department_id]);

  const fetchUsers = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async (departmentId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses?department_id=${departmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    if (!token) return alert("You are not logged in");

    try {
      await axios.post("http://localhost:5000/api/admin/add-user", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);

      setForm({
        user_id: "",
        name: "",
        email: "",
        password: "",
        role: "student",
        department_id: "",
        course_id: "",
      });

      fetchUsers(token);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">QR Code</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>

                <td className="px-4 py-2">
                  {departments.find((d) => d.id === user.department_id)?.name ||
                    "-"}
                </td>

                <td className="px-4 py-2">
                  {courses.find((c) => c.id === user.course_id)?.course_name ||
                    "-"}
                </td>

                <td className="px-4 py-2">
                  {user.barcode ? (
                    <img
                      src={user.barcode}
                      alt="QR"
                      className="w-16 h-16"
                    />
                  ) : (
                    "No QR"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Add User</h2>

            <input
              type="text"
              placeholder="User ID"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />

            {/* Role Dropdown */}
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="demo">Demo</option>
              <option value="admin">Admin</option>
            </select>

            {/* Department Dropdown */}
            <select
              value={form.department_id}
              onChange={(e) =>
                setForm({ ...form, department_id: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="">-- Select Department --</option>

              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Courses Dropdown – Loads after dept selection */}
            <select
              value={form.course_id}
              onChange={(e) =>
                setForm({ ...form, course_id: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
              disabled={!form.department_id}
            >
              <option value="">-- Select Course --</option>

              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
