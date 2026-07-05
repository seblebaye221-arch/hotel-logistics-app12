"use client";

import { useState, useEffect } from "react";

type Item = {
  name: string;
  quantity: number;
  price: number;
  bestBefore: string;
};

const STORAGE_KEY = "logisticsItems";

export default function AddItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [bestBefore, setBestBefore] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const getDaysLeft = (dateStr: string) => {
    if (!dateStr) return null;
    const today = new Date();
    const expiry = new Date(dateStr);
    const diff = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const getExpiryStatus = (dateStr: string) => {
    const days = getDaysLeft(dateStr);
    if (days === null) return null;
    if (days < 0) return { label: "Expired!", color: "text-red-600 bg-red-100" };
    if (days <= 3) return { label: `Expires in ${days} day(s)!`, color: "text-yellow-700 bg-yellow-100" };
    return { label: `${days} days left`, color: "text-green-700 bg-green-100" };
  };

  const handleAdd = () => {
    if (!name || !quantity || !price) {
      alert("Please fill in all fields");
      return;
    }
    if (Number(quantity) <= 0 || Number(price) <= 0) {
      alert("Quantity and price must be greater than 0");
      return;
    }

    const newItem: Item = {
      name,
      quantity: Number(quantity),
      price: Number(price),
      bestBefore,
    };

    setItems([...items, newItem]);
    setName("");
    setQuantity("");
    setPrice("");
    setBestBefore("");
  };

  const handleDelete = (indexToDelete: number) => {
    const updated = items.filter((_, index) => index !== indexToDelete);
    setItems(updated);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Add Item
      </h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. Potato"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Quantity (kg)
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. 50"
          min="1"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Price per kg (Birr)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. 20"
          min="1"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Best Before Date (Expiry)
        </label>
        <input
          type="date"
          value={bestBefore}
          onChange={(e) => setBestBefore(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800 font-bold"
        >
          Add Item
        </button>
      </div>

      <div className="w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Items List:
        </h2>

        {items.length === 0 && (
          <p className="text-gray-400">No items added yet.</p>
        )}

        {items.map((item, index) => {
          const expiry = item.bestBefore ? getExpiryStatus(item.bestBefore) : null;
          return (
            <div
              key={index}
              className="bg-white p-3 rounded shadow mb-2 text-gray-900"
            >
              <div className="flex justify-between items-center">
                <span className="capitalize font-bold">{item.name}</span>
                <span>
                  {item.quantity} kg x {item.price} Birr ={" "}
                  <strong>{item.quantity * item.price} Birr</strong>
                </span>
                <button
                  onClick={() => handleDelete(index)}
                  className="ml-3 text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
              {expiry && (
                <div className={`mt-1 text-sm px-2 py-1 rounded font-medium ${expiry.color}`}>
                  Best Before: {item.bestBefore} — {expiry.label}
                </div>
              )}
            </div>
          );
        })}

        {items.length > 0 && (
          <div className="bg-green-100 p-3 rounded shadow mt-4 flex justify-between font-bold text-green-800">
            <span>Grand Total</span>
            <span>
              {items.reduce((sum, item) => sum + item.quantity * item.price, 0)} Birr
            </span>
          </div>
        )}
      </div>
    </main>
  );
}