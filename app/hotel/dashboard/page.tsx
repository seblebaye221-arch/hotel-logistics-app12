"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function HotelDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/hotel/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700">
        Welcome to the Hotel Dashboard
      </h1>
      <p className="text-gray-600 mt-2 mb-6">You are logged in!</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}