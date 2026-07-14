"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogisticsSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userType", "logistics");
      router.push("/logistics/dashboard");
    } catch (err: any) {
      setError("Signup failed: " + err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-2">Logistics Manager Signup</h1>
      <p className="text-gray-500 mb-6">Create an account to access the Logistics Management System</p>

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
          placeholder="At least 6 characters"
        />
        <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Re-enter password"
        />
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <button
          onClick={handleSignup}
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800 font-bold mb-3"
        >
          Sign Up as Logistics Manager
        </button>
        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link href="/logistics/login" className="text-green-700 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}