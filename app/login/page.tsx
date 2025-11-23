"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user",  JSON.stringify(res.data.user));

      console.log(res.data.user.role);

      if (res.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (res.data.user.role === "lecturer") {
        router.push("/lecturer/dashboard");
      } else if (res.data.user.role === "student") {
        router.push("/student/dashboard");
      } else if (res.data.user.role=== "demo") {
        router.push("/demo/dashboard");
      } else if (res.data.user.role === "lab_assistant") {
        router.push("/lab/dashboard");
      } else if (res.data.user.role === "office_staff") {
        router.push("/office/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
