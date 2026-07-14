"use client";

import { useState, useEffect } from "react";
import { subscribeToInventory, InventoryItem } from "@/lib/inventory";

const LOW_STOCK_LIMIT = 10;

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToInventory(setItems);
    return () => unsubscribe();
  }, []);

  const getStatus = (stock: number) => {
    if (stock <= 3) {
      return { label: "Critical!", color: "text-red-600", bg: "bg-red-100" };
    } else if (stock <= LOW_STOCK_LIMIT) {
      return { label: "Low Stock!", color: "text-orange-600", bg: "bg-orange-100" };
    } else {
      return { label: "Good", color: "text-green-600", bg: "bg-green-100" };
    }
  };

  const criticalItems = items.filter((item) => item.stock <= 3);
  const lowItems = items.filter(
    (item) => item.stock > 3 && item.stock <= LOW_STOCK_LIMIT
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Inventory Tracking
      </h1>
      <p className="text-gray-600 mb-6">
        Monitor your stock levels and get warnings when items are low
      </p>

      {criticalItems.length > 0 && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4">
          <p className="font-bold text-lg">CRITICAL STOCK ALERT!</p>
          {criticalItems.map((item) => (
            <p key={item.id}>
              {item.name} has only {item.stock} kg left — Order immediately!
            </p>
          ))}
        </div>
      )}

      {lowItems.length > 0 && (
        <div className="w-full bg-orange-100 border border-orange-400 text-orange-700 p-4 rounded-lg mb-4">
          <p className="font-bold text-lg">Low Stock Warning!</p>
          {lowItems.map((item) => (
            <p key={item.id}>
              {item.name} is running low — {item.stock} kg remaining.
            </p>
          ))}
        </div>
      )}

      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="bg-blue-700 text-white p-3 rounded-t-lg font-bold grid grid-cols-4 text-center">
          <span>Item</span>
          <span>Stock (kg)</span>
          <span>Price/kg</span>
          <span>Status</span>
        </div>

        {items.length === 0 && (
          <p className="p-4 text-gray-600 text-center font-medium">
            No items found. Add items from the Logistics page first.
          </p>
        )}

        {items.map((item) => {
          const status = getStatus(item.stock);
          return (
            <div
              key={item.id}
              className={`grid grid-cols-4 text-center p-3 border-b items-center ${status.bg}`}
            >
              <span className="capitalize font-bold text-gray-900">
                {item.name}
              </span>
              <span className="font-bold text-gray-900">
                {item.stock} kg
              </span>
              <span className="font-bold text-gray-900">
                {item.price} Birr
              </span>
              <span className={`font-bold ${status.color}`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="w-full mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="font-bold text-green-700 text-xl">
              {items.filter((i) => i.stock > LOW_STOCK_LIMIT).length}
            </p>
            <p className="text-green-600 text-sm font-medium">Good Stock</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg text-center">
            <p className="font-bold text-orange-700 text-xl">
              {lowItems.length}
            </p>
            <p className="text-orange-600 text-sm font-medium">Low Stock</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="font-bold text-red-700 text-xl">
              {criticalItems.length}
            </p>
            <p className="text-red-600 text-sm font-medium">Critical</p>
          </div>
        </div>
      )}
    </main>
  );
}