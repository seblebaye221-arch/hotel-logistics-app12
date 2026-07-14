"use client";

import Link from "next/link";
import { useRoleGuard } from "@/app/hooks/useRoleGuard";

export default function LogisticsDashboard() {
  useRoleGuard("logistics");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-2">Logistics Manager Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage suppliers, items, prices and inventory</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <Link href="/logistics/add" className="bg-blue-100 p-6 rounded-lg shadow text-center hover:bg-blue-200">
          <p className="text-2xl font-bold text-blue-700">Add Item</p>
          <p className="text-gray-600 text-sm mt-1">Add new items to the system</p>
        </Link>
        <Link href="/suppliers" className="bg-purple-100 p-6 rounded-lg shadow text-center hover:bg-purple-200">
          <p className="text-2xl font-bold text-purple-700">Suppliers</p>
          <p className="text-gray-600 text-sm mt-1">Manage supplier information</p>
        </Link>
        <Link href="/menu" className="bg-yellow-100 p-6 rounded-lg shadow text-center hover:bg-yellow-200">
          <p className="text-2xl font-bold text-yellow-700">Price List</p>
          <p className="text-gray-600 text-sm mt-1">View item prices</p>
        </Link>



<Link href="/logistics/orders" className="bg-green-100 p-6 rounded-lg shadow text-center hover:bg-green-200">
  <p className="text-2xl font-bold text-green-700">Incoming Orders</p>
  <p className="text-gray-600 text-sm mt-1">See what Hotel has ordered</p>
</Link>




        <Link href="/compare" className="bg-orange-100 p-6 rounded-lg shadow text-center hover:bg-orange-200">
          <p className="text-2xl font-bold text-orange-700">Compare Prices</p>
          <p className="text-gray-600 text-sm mt-1">Find the cheapest supplier</p>
        </Link>
        <Link href="/inventory" className="bg-red-100 p-6 rounded-lg shadow text-center hover:bg-red-200">
          <p className="text-2xl font-bold text-red-700">Inventory</p>
          <p className="text-gray-600 text-sm mt-1">Check stock and available items</p>
        </Link>
      </div>
    </main>
  );
}