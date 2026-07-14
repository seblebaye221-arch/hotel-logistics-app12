"use client";

import Link from "next/link";
import { useRoleGuard } from "@/app/hooks/useRoleGuard";

export default function HotelDashboard() {
  useRoleGuard("hotel");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Hotel Manager Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome! Manage your hotel supply chain from here.</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <Link href="/inventory" className="bg-red-100 p-6 rounded-lg shadow text-center hover:bg-red-200">
          <p className="text-2xl font-bold text-red-700">Inventory</p>
          <p className="text-gray-600 text-sm mt-1">Check stock levels</p>
        </Link>
        <Link href="/orders" className="bg-green-100 p-6 rounded-lg shadow text-center hover:bg-green-200">
          <p className="text-2xl font-bold text-green-700">Order History</p>
          <p className="text-gray-600 text-sm mt-1">View past orders</p>
        </Link>
        <Link href="/analytics" className="bg-blue-100 p-6 rounded-lg shadow text-center hover:bg-blue-200">
          <p className="text-2xl font-bold text-blue-700">Analytics</p>
          <p className="text-gray-600 text-sm mt-1">Reports & charts</p>
        </Link>
        <Link href="/store" className="bg-purple-100 p-6 rounded-lg shadow text-center hover:bg-purple-200">
          <p className="text-2xl font-bold text-purple-700">Online Store</p>
          <p className="text-gray-600 text-sm mt-1">Buy supplies online</p>
        </Link>
        <Link href="/profile" className="bg-gray-100 p-6 rounded-lg shadow text-center hover:bg-gray-200">
          <p className="text-2xl font-bold text-gray-700">Profile</p>
          <p className="text-gray-600 text-sm mt-1">Hotel information</p>
        </Link>
      </div>
    </main>
  );
}