"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, userType } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userType");
    setShowDropdown(false);
    router.push("/");
  };

  return (
    <nav className="w-full bg-blue-800 text-white p-4 flex items-center justify-between relative">
      <Link href="/" className="font-bold text-xl">
        Hotel & Logistics
      </Link>

      <div className="flex gap-4 items-center flex-wrap">
        {user && userType === "hotel" && (
          <>
            <Link href="/hotel/dashboard" className="hover:underline text-sm">Dashboard</Link>
            <Link href="/inventory" className="hover:underline text-sm text-red-300 font-bold">Inventory</Link>
            <Link href="/orders" className="hover:underline text-sm text-green-300 font-bold">Orders</Link>
            <Link href="/analytics" className="hover:underline text-sm text-cyan-300 font-bold">Analytics</Link>
            <Link href="/store" className="hover:underline text-sm text-purple-300 font-bold">Online Store</Link>
          </>
        )}

        {user && userType === "logistics" && (
          <>
            <Link href="/logistics/dashboard" className="hover:underline text-sm">Dashboard</Link>
            <Link href="/logistics/add" className="hover:underline text-sm text-blue-300 font-bold">Add Item</Link>
            <Link href="/menu" className="hover:underline text-sm text-yellow-300 font-bold">Price List</Link>
            <Link href="/suppliers" className="hover:underline text-sm text-pink-300 font-bold">Suppliers</Link>

            <Link href="/logistics/orders" className="hover:underline text-sm text-green-300 font-bold">Incoming Orders</Link>

            <Link href="/compare" className="hover:underline text-sm text-orange-300 font-bold">Compare</Link>
            <Link href="/inventory" className="hover:underline text-sm text-red-300 font-bold">Inventory</Link>
          </>
        )}
      </div>

      <div className="relative">
        {!user ? (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold hover:bg-blue-100 text-lg"
          >
            👤
          </button>
        ) : (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold hover:bg-yellow-300 text-lg"
          >
            {user.email?.charAt(0).toUpperCase()}
          </button>
        )}

        {showDropdown && (
          <div className="absolute right-0 top-12 bg-white text-gray-900 rounded-lg shadow-xl w-56 z-50 overflow-hidden">
            {!user ? (
              <>
                <div className="bg-blue-700 text-white p-3">
                  <p className="font-bold text-sm">Welcome!</p>
                  <p className="text-xs text-blue-200">Please login to continue</p>
                </div>
                <Link href="/hotel/login" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b">
                  <span className="text-blue-700 text-lg">🏨</span>
                  <div><p className="font-medium text-sm">Hotel Manager Login</p><p className="text-xs text-gray-500">Access hotel system</p></div>
                </Link>
                <Link href="/logistics/login" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                  <span className="text-green-700 text-lg">📦</span>
                  <div><p className="font-medium text-sm">Logistics Manager Login</p><p className="text-xs text-gray-500">Access logistics system</p></div>
                </Link>
              </>
            ) : (
              <>
                <div className={`p-3 ${userType === "hotel" ? "bg-blue-700" : "bg-green-700"} text-white`}>
                  <p className="font-bold text-sm">{user.email}</p>
                  <p className="text-xs opacity-80">{userType === "hotel" ? "Hotel Manager" : "Logistics Manager"}</p>
                </div>
                <Link href="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b">
                  <span className="text-lg">👤</span>
                  <div><p className="font-medium text-sm">My Profile</p><p className="text-xs text-gray-500">View & edit profile</p></div>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 p-3 hover:bg-red-50 w-full text-left text-red-600">
                  <span className="text-lg">🚪</span>
                  <div><p className="font-medium text-sm">Logout</p><p className="text-xs text-red-400">Sign out of your account</p></div>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
    </nav>
  );
}