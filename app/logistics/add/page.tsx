"use client";

import { useState, useEffect } from "react";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

const STORAGE_KEY = "logisticsItems";

export default function AddItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  // When the page first opens, load any items
  // previously saved in this browser's localStorage.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // Every time "items" changes, save the updated list
  // back into localStorage automatically.
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const handleAdd = () => {
    if (!name || !quantity || !price) {
      alert("Please fill in all fields");
      return;
    }

    const newItem: Item = {
      name: name,
      quantity: Number(quantity),
      price: Number(price),
    };

    setItems([...items, newItem]);

    setName("");
    setQuantity("");
    setPrice("");
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedItems = items.filter((_, index) => index !== indexToDelete);
    setItems(updatedItems);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Add Item (e.g. Potato)
      </h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          placeholder="e.g. Potato"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Quantity (kg)
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          placeholder="e.g. 1"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Price per kg (Birr)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          placeholder="e.g. 20"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
        >
          Add Item
        </button>
      </div>

      <div className="w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Items List:
        </h2>

        {items.length === 0 && (
          <p className="text-gray-400">No items added yet.</p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center text-gray-900 font-medium"
          >
            <span className="capitalize">{item.name}</span>
            <span>
              {item.quantity} kg × {item.price} Birr ={" "}
              <strong>{item.quantity * item.price} Birr</strong>
            </span>
            <button
              onClick={() => handleDelete(index)}
              className="ml-3 text-red-600 hover:text-red-800 text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        ))}

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