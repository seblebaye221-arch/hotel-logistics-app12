"use client";

import { useState, useEffect } from "react";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

type Supplier = {
  id: string;
  name: string;
  status: string;
  products: string;
};

export default function Analytics() {
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem("logisticsItems");
    const savedOrders = localStorage.getItem("orderHistory");
    const savedSuppliers = localStorage.getItem("suppliers");
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
  }, []);

  // Calculate total spent
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  // Calculate top items purchased
  const itemCount: { [key: string]: number } = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
    });
  });
  const topItems = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Supplier performance
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length;
  const delayedSuppliers = suppliers.filter((s) => s.status === "Delayed").length;
  const unavailableSuppliers = suppliers.filter((s) => s.status === "Unavailable").length;

  // Max quantity for bar chart scaling
  const maxQty = topItems.length > 0 ? Math.max(...topItems.map((i) => i[1])) : 1;

  // Total inventory value
  const totalInventoryValue = items.reduce(
    (sum, item) => sum + item.quantity * item.price, 0
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Reporting & Analytics
      </h1>
      <p className="text-gray-600 mb-6">
        Visual overview of your supply chain performance
      </p>

      {/* Summary Cards */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-blue-700 text-2xl">{orders.length}</p>
          <p className="text-blue-600 text-sm font-medium">Total Orders</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-green-700 text-2xl">{totalSpent}</p>
          <p className="text-green-600 text-sm font-medium">Total Spent (Birr)</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-purple-700 text-2xl">{items.length}</p>
          <p className="text-purple-600 text-sm font-medium">Total Items</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-orange-700 text-2xl">{suppliers.length}</p>
          <p className="text-orange-600 text-sm font-medium">Total Suppliers</p>
        </div>
      </div>

      {/* Top Items Chart */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Top Items Purchased (by quantity)
        </h2>
        {topItems.length === 0 ? (
          <p className="text-gray-500 text-center">
            No orders yet. Place orders from Price List to see data.
          </p>
        ) : (
          <div className="space-y-3">
            {topItems.map(([name, qty], index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize font-medium text-gray-900">
                    {index + 1}. {name}
                  </span>
                  <span className="font-bold text-gray-900">{qty} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(qty / maxQty) * 100}%` }}
                  >
                    <span className="text-white text-xs font-bold">{qty}kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Performance */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Supplier Performance
        </h2>
        {suppliers.length === 0 ? (
          <p className="text-gray-500 text-center">
            No suppliers yet. Add suppliers to see performance data.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Active */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-green-700">Active Suppliers</span>
                <span className="font-bold text-green-700">{activeSuppliers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-green-500 h-6 rounded-full"
                  style={{
                    width: suppliers.length > 0
                      ? `${(activeSuppliers / suppliers.length) * 100}%`
                      : "0%"
                  }}
                />
              </div>
            </div>

            {/* Delayed */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-yellow-700">Delayed Suppliers</span>
                <span className="font-bold text-yellow-700">{delayedSuppliers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-yellow-500 h-6 rounded-full"
                  style={{
                    width: suppliers.length > 0
                      ? `${(delayedSuppliers / suppliers.length) * 100}%`
                      : "0%"
                  }}
                />
              </div>
            </div>

            {/* Unavailable */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-red-700">Unavailable Suppliers</span>
                <span className="font-bold text-red-700">{unavailableSuppliers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-red-500 h-6 rounded-full"
                  style={{
                    width: suppliers.length > 0
                      ? `${(unavailableSuppliers / suppliers.length) * 100}%`
                      : "0%"
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Value */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Current Inventory Value
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">
            No items in inventory yet.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const value = item.quantity * item.price;
              const maxValue = Math.max(...items.map((i) => i.quantity * i.price));
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize font-medium text-gray-900">
                      {item.name} ({item.quantity}kg)
                    </span>
                    <span className="font-bold text-gray-900">{value} Birr</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5">
                    <div
                      className="bg-purple-500 h-5 rounded-full"
                      style={{ width: `${(value / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="mt-4 p-3 bg-purple-100 rounded-lg flex justify-between font-bold text-purple-800">
              <span>Total Inventory Value</span>
              <span>{totalInventoryValue} Birr</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}