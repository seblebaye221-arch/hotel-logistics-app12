"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, updatePassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HotelManagerProfile() {
  const [user, setUser] = useState<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Hotel specific info
  const [hotelName, setHotelName] = useState("");
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [hotelRooms, setHotelRooms] = useState("");
  const [hotelType, setHotelType] = useState("3 Star");
  const [saved, setSaved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Load saved photo
        const savedPhoto = localStorage.getItem("profilePhoto");
        if (savedPhoto) setPhoto(savedPhoto);
        // Load saved hotel info
        const savedHotelInfo = localStorage.getItem("hotelInfo");
        if (savedHotelInfo) {
          const info = JSON.parse(savedHotelInfo);
          setHotelName(info.hotelName || "");
          setHotelLocation(info.hotelLocation || "");
          setHotelPhone(info.hotelPhone || "");
          setHotelRooms(info.hotelRooms || "");
          setHotelType(info.hotelType || "3 Star");
        }
      } else {
        router.push("/hotel/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveHotelInfo = () => {
    const hotelInfo = {
      hotelName,
      hotelLocation,
      hotelPhone,
      hotelRooms,
      hotelType,
    };
    localStorage.setItem("hotelInfo", JSON.stringify(hotelInfo));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async () => {
    setMessage("");
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError("Error: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/hotel/login");
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Hotel Manager Profile
      </h1>
      <p className="text-gray-600 mb-6">
        Manage your hotel information and account settings
      </p>

      {/* Profile Photo & Account Info */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Account Information
        </h2>

        <div className="flex items-center gap-4 mb-4">
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-200">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-1 py-0.5 rounded cursor-pointer hover:bg-green-700 font-bold">
              Edit
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setPhoto(reader.result as string);
                      localStorage.setItem("profilePhoto", reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {/* Account Details */}
          <div>
            <p className="font-bold text-gray-900 text-lg">
              {hotelName || "Hotel Manager"}
            </p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm">
              Member since:{" "}
              {user.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
              Hotel Manager
            </span>
          </div>
        </div>
      </div>

      {/* Hotel Information */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Hotel Information
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Hotel Name
        </label>
        <input
          type="text"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. Addis Luxury Hotel"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Hotel Location
        </label>
        <input
          type="text"
          value={hotelLocation}
          onChange={(e) => setHotelLocation(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. Addis Ababa, Bole"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Hotel Phone Number
        </label>
        <input
          type="text"
          value={hotelPhone}
          onChange={(e) => setHotelPhone(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. 0911234567"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Number of Rooms
        </label>
        <input
          type="number"
          value={hotelRooms}
          onChange={(e) => setHotelRooms(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. 50"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Hotel Type
        </label>
        <select
          value={hotelType}
          onChange={(e) => setHotelType(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
        >
          <option value="1 Star">1 Star</option>
          <option value="2 Star">2 Star</option>
          <option value="3 Star">3 Star</option>
          <option value="4 Star">4 Star</option>
          <option value="5 Star">5 Star</option>
          <option value="Guest House">Guest House</option>
          <option value="Lodge">Lodge</option>
        </select>

        {saved && (
          <p className="text-green-600 font-medium mb-3">
            Hotel information saved successfully!
          </p>
        )}

        <button
          onClick={handleSaveHotelInfo}
          className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold"
        >
          Save Hotel Information
        </button>
      </div>

      {/* Change Password */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Change Password
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter new password"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Confirm new password"
        />

        {message && (
          <p className="text-green-600 font-medium mb-3">{message}</p>
        )}
        {error && (
          <p className="text-red-600 font-medium mb-3">{error}</p>
        )}

        <button
          onClick={handlePasswordChange}
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800 font-bold"
        >
          Update Password
        </button>
      </div>

      {/* Logout */}
      <div className="w-full max-w-lg">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700 font-bold"
        >
          Logout
        </button>
      </div>
    </main>
  );
}