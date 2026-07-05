"use client";

import { useState, useEffect } from "react";

type Supplier = {
  id: string;
  name: string;
  phone: string;
  products: string;
  location: string;
  type: "Primary" | "Backup";
  status: "Active" | "Delayed" | "Unavailable";
  backupSupplier?: string;
};

const SUPPLIERS_KEY = "suppliers";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [products, setProducts] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"Primary" | "Backup">("Primary");
  const [backupSupplier, setBackupSupplier] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(SUPPLIERS_KEY);
    if (saved) setSuppliers(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (!name || !phone || !products || !location) {
      alert("Please fill in all fields");
      return;
    }

    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name,
      phone,
      products,
      location,
      type,
      status: "Active",
      backupSupplier,
    };

    const updated = [...suppliers, newSupplier];
    setSuppliers(updated);
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));

    setName("");
    setPhone("");
    setProducts("");
    setLocation("");
    setType("Primary");
    setBackupSupplier("");
  };

  const handleDelete = (id: string) => {
    const updated = suppliers.filter((s) => s.id !== id);
    setSuppliers(updated);
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  };

  const handleStatusChange = (id: string, status: "Active" | "Delayed" | "Unavailable") => {
    const updated = suppliers.map((s) =>
      s.id === id ? { ...s, status } : s
    );
    setSuppliers(updated);
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  };

  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-green-700 bg-green-100";
    if (status === "Delayed") return "text-yellow-700 bg-yellow-100";
    return "text-red-700 bg-red-100";
  };

  const delayedSuppliers = suppliers.filter((s) => s.status === "Delayed" || s.status === "Unavailable");

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Supplier Management
      </h1>
      <p className="text-gray-600 mb-6">
        Manage primary and backup suppliers
      </p>

      {/* Delayed Supplier Alert */}
      {delayedSuppliers.length > 0 && (
        <div className="w-full max-w-lg bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg mb-4">
          <p className="font-bold text-lg">Supplier Delay Alert!</p>
          {delayedSuppliers.map((s) => (
            <div key={s.id} className="mt-2">
              <p>{s.name} is {s.status}!</p>
              {s.backupSupplier && (
                <button
                  onClick={() => alert(`Ordering from backup supplier: ${s.backupSupplier}`)}
                  className="mt-1 bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-800"
                >
                  Order from Backup: {s.backupSupplier}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Form */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Add New Supplier
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Supplier Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="e.g. Abebe Farm"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="e.g. 0911234567"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Products Supplied
        </label>
        <input
          type="text"
          value={products}
          onChange={(e) => setProducts(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="e.g. Potato, Tomato, Onion"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="e.g. Addis Ababa, Merkato"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Supplier Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "Primary" | "Backup")}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
        >
          <option value="Primary">Primary Supplier</option>
          <option value="Backup">Backup Supplier</option>
        </select>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Backup Supplier Name (if Primary fails)
        </label>
        <input
          type="text"
          value={backupSupplier}
          onChange={(e) => setBackupSupplier(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="e.g. Supermarket XYZ"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold"
        >
          Add Supplier
        </button>
      </div>

      {/* Suppliers List */}
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Registered Suppliers ({suppliers.length})
        </h2>

        {suppliers.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              No suppliers yet. Add your first supplier above.
            </p>
          </div>
        )}

        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className={`bg-white p-4 rounded-lg shadow-md mb-3 border-l-4 ${
              supplier.type === "Primary" ? "border-blue-700" : "border-orange-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900 text-lg">
                    {supplier.name}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${
                    supplier.type === "Primary"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {supplier.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Phone: <span className="font-medium text-gray-900">{supplier.phone}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Products: <span className="font-medium text-gray-900">{supplier.products}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Location: <span className="font-medium text-gray-900">{supplier.location}</span>
                </p>
                {supplier.backupSupplier && (
                  <p className="text-gray-600 text-sm">
                    Backup: <span className="font-medium text-orange-700">{supplier.backupSupplier}</span>
                  </p>
                )}

                {/* Status Selector */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <select
                    value={supplier.status}
                    onChange={(e) =>
                      handleStatusChange(
                        supplier.id,
                        e.target.value as "Active" | "Delayed" | "Unavailable"
                      )
                    }
                    className={`text-sm px-2 py-1 rounded font-bold border ${getStatusColor(supplier.status)}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleDelete(supplier.id)}
                className="text-red-600 hover:text-red-800 font-bold text-sm ml-4"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}