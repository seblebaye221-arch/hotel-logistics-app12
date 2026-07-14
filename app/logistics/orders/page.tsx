"use client";

import { useEffect, useRef, useState } from "react";
import { useRoleGuard } from "@/app/hooks/useRoleGuard";
import { subscribeToAllOrders, updateOrderStatus, Order, OrderStatus } from "@/lib/orders";

export default function LogisticsOrders() {
  useRoleGuard("logistics");
  const [orders, setOrders] = useState<Order[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const knownIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((newOrders) => {
      if (!isFirstLoad.current) {
        const brandNewOrders = newOrders.filter((o) => !knownIds.current.has(o.id));
        if (brandNewOrders.length > 0) {
          const first = brandNewOrders[0];
          const itemSummary = first.items.map((i) => i.itemName).join(", ");
          setNotification(
            `🔔 New order received! ${itemSummary} — ${first.total} Birr — Payment: ${first.paymentMethod}`
          );
          setTimeout(() => setNotification(null), 6000);
        }
      }
      knownIds.current = new Set(newOrders.map((o) => o.id));
      isFirstLoad.current = false;
      setOrders(newOrders);
    });
    return () => unsubscribe();
  }, []);

  const statusColor: Record<OrderStatus, string> = {
    Processing: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 relative">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-pulse max-w-lg text-center">
          {notification}
        </div>
      )}

      <h1 className="text-2xl font-bold text-green-700 mb-2">Incoming Orders</h1>
      <p className="text-gray-600 mb-6">Orders placed by Hotel Managers from the Online Store</p>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      <div className="flex flex-col gap-4 max-w-3xl">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-green-700 text-white p-3 flex justify-between items-center">
              <div>
                <p className="font-bold">Order #{order.id.slice(0, 6).toUpperCase()}</p>
                <p className="text-xs opacity-80">From: {order.hotelEmail}</p>
              </div>
              <p className="font-bold">{order.total} Birr</p>
            </div>
            <div className="p-4">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-gray-800">
                  {item.itemName} — {item.quantity} kg — {item.price * item.quantity} Birr
                </p>
              ))}
              <p className="text-sm text-gray-500 mt-2">Payment: {order.paymentMethod}</p>

              <div className="flex items-center gap-2 mt-3">
                <label className="text-sm text-gray-600">Status:</label>
                {order.status === "Delivered" ? (
                  <span className={`border p-1 rounded text-sm font-bold ${statusColor[order.status]}`}>
                    Delivered (confirmed by Hotel)
                  </span>
                ) : (
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className={`border p-1 rounded text-sm font-bold ${statusColor[order.status]}`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}