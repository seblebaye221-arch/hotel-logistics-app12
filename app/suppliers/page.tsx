"use client";

import { useState, useEffect } from "react";

type Supplier = {
  id: string;
  name: string;
  phone: string;
  products: string;
  location: string;
};

const SUPPLIERS_KEY = "suppliers";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [products, setProducts] = useState("");
  const [location, setLocation] = useState("");

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
    };

    const updated = [...suppliers, newSupplier];
    setSuppliers(updated);
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));

    setName("");
    setPhone("");
    setProducts("");
    setLocation("");
  };

  const handleDelete = (id: string) => {
    const updated = suppliers.filter((s) => s.id !== id);
    setSuppliers(updated);
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(updated));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Supplier Management
      </h1>
      <p className="text-gray-600 mb-6">
        Register and manage your suppliers (farmers, supermarkets, etc.)
      </p>

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
            className="bg-white p-4 rounded-lg shadow-md mb-3 border-l-4 border-blue-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {supplier.name}
                </p>
                <p className="text-gray-600 text-sm">
                  Phone: <span className="font-medium text-gray-900">{supplier.phone}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Products: <span className="font-medium text-gray-900">{supplier.products}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Location: <span className="font-medium text-gray-900">{supplier.location}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="text-red-600 hover:text-red-800 font-bold text-sm"
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