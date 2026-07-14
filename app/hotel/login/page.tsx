"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function HotelLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userType", "hotel");
      router.push("/hotel/dashboard");
    } catch (err: any) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Hotel Manager Login
      </h1>
      <p className="text-gray-500 mb-6">Sign in to access Hotel Management System</p>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter email"
        />
        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter password"
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold"
        >
          Login as Hotel Manager
        </button>

<p className="text-sm text-gray-500 text-center mt-3">
          Don&apos;t have an account?{" "}
          <a href="/hotel/signup" className="text-blue-700 font-medium hover:underline">Sign up</a>
        </p>

      </div>
    </main>
  );
}