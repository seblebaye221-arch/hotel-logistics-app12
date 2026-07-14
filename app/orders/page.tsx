"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthContext";
import { subscribeToMyOrders, deleteOrder, updateOrderStatus, Order } from "@/lib/orders";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = subscribeToMyOrders(user.email, setOrders);
    return () => unsubscribe();
  }, [user?.email]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
  };

  const formatDate = (createdAt: any) => {
    if (!createdAt?.toDate) return "";
    return createdAt.toDate().toLocaleDateString();
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-1">Order History</h1>
      <p className="text-gray-600 text-center mb-6">All past orders placed by this hotel account</p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="font-bold text-blue-700 text-2xl">{totalOrders}</p>
          <p className="text-blue-700 text-sm">Total Orders</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="font-bold text-green-700 text-2xl">{totalSpent} Birr</p>
          <p className="text-green-700 text-sm">Total Spent</p>
        </div>
      </div>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center">No orders yet.</p>
      )}

      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="bg-blue-700 text-white p-3 flex justify-between items-start">
              <div>
                <p className="font-bold">Order #{order.id.slice(0, 4).toUpperCase()}</p>
                <p className="text-xs opacity-80">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.total} Birr</p>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="text-red-200 text-xs hover:text-red-100 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="p-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-800 py-1 border-b last:border-b-0">
                  <span>{item.itemName}</span>
                  <span>{item.quantity} kg x {item.price} Birr = <strong>{item.quantity * item.price} Birr</strong></span>
                </div>
              ))}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm font-bold text-gray-700">Status: {order.status}</span>
                {order.status === "Shipped" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className="bg-green-700 text-white text-xs px-3 py-1 rounded font-bold hover:bg-green-800"
                  >
                    Confirm Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}