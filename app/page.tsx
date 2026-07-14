"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

export default function Home() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user && userType === "hotel") router.push("/hotel/dashboard");
    if (user && userType === "logistics") router.push("/logistics/dashboard");
  }, [user, userType, loading, router]);

  if (loading || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
        Hotel & Logistics Supply Chain Management
      </h1>
      <p className="text-gray-600 max-w-xl mb-8">
        A complete digital system for managing hotel supplies and logistics operations.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm mb-10">
        <Link href="/hotel/login" className="bg-blue-700 text-white py-3 rounded font-bold hover:bg-blue-800">
          Hotel Manager Login
        </Link>
        <Link href="/logistics/login" className="bg-green-700 text-white py-3 rounded font-bold hover:bg-green-800">
          Logistics Manager Login
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Hotel</h2>
          <p className="text-gray-600 text-sm">Manage inventory, orders, analytics</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">Logistics</h2>
          <p className="text-gray-600 text-sm">Manage suppliers, delivery, price list</p>
        </div>
      </div>
    </main>
  );
}