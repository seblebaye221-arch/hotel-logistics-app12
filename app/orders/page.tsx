"use client";

import { useState, useEffect } from "react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
};

const ORDERS_KEY = "orderHistory";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter((order) => order.id !== id);
    setOrders(updated);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  };

  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Order History
      </h1>
      <p className="text-gray-600 mb-6">
        All past orders placed by buyers
      </p>

      {orders.length === 0 && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 font-medium">
            No orders yet. Place an order from the Price List page.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="w-full max-w-lg grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="font-bold text-blue-700 text-2xl">
                {orders.length}
              </p>
              <p className="text-blue-600 font-medium">Total Orders</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="font-bold text-green-700 text-2xl">
                {grandTotal} Birr
              </p>
              <p className="text-green-600 font-medium">Total Spent</p>
            </div>
          </div>

          {/* Orders List */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="w-full max-w-lg bg-white rounded-lg shadow-md mb-4 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-blue-700 text-white p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold">Order #{order.id.slice(-4)}</p>
                  <p className="text-sm text-blue-200">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{order.total} Birr</p>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-300 hover:text-red-100 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Order Items */}
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 border-b text-gray-900"
                >
                  <span className="capitalize font-medium">{item.name}</span>
                  <span>
                    {item.quantity} kg x {item.price} Birr ={" "}
                    <strong>{item.quantity * item.price} Birr</strong>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </main>
  );
}