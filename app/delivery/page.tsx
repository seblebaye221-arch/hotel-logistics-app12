"use client";

import { useState, useEffect } from "react";

type Order = {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

type Delivery = {
  id: string;
  orderId: string;
  orderDate: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  driverName: string;
  driverPhone: string;
  estimatedTime: string;
  status: "Pending" | "Picked Up" | "On the Way" | "Delivered";
  assignedDate: string;
};

const DELIVERY_KEY = "deliveries";

export default function DeliverySystem() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    const savedOrders = localStorage.getItem("orderHistory");
    const savedDeliveries = localStorage.getItem(DELIVERY_KEY);
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedDeliveries) setDeliveries(JSON.parse(savedDeliveries));
  }, []);

  const getUnassignedOrders = () => {
    const assignedOrderIds = deliveries.map((d) => d.orderId);
    return orders.filter((o) => !assignedOrderIds.includes(o.id));
  };

  const handleAssignDriver = () => {
    if (!selectedOrder || !driverName || !driverPhone || !estimatedTime) {
      alert("Please fill in all fields!");
      return;
    }

    const order = orders.find((o) => o.id === selectedOrder);
    if (!order) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      orderId: order.id,
      orderDate: order.date,
      items: order.items,
      total: order.total,
      driverName,
      driverPhone,
      estimatedTime,
      status: "Pending",
      assignedDate: new Date().toLocaleDateString(),
    };

    const updated = [newDelivery, ...deliveries];
    setDeliveries(updated);
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(updated));

    setSelectedOrder("");
    setDriverName("");
    setDriverPhone("");
    setEstimatedTime("");
    alert("Driver assigned successfully!");
  };

  const handleStatusChange = (
    id: string,
    status: "Pending" | "Picked Up" | "On the Way" | "Delivered"
  ) => {
    const updated = deliveries.map((d) =>
      d.id === id ? { ...d, status } : d
    );
    setDeliveries(updated);
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = deliveries.filter((d) => d.id !== id);
    setDeliveries(updated);
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(updated));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-gray-100 text-gray-700";
      case "Picked Up": return "bg-blue-100 text-blue-700";
      case "On the Way": return "bg-yellow-100 text-yellow-700";
      case "Delivered": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Pending": return 1;
      case "Picked Up": return 2;
      case "On the Way": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  // Summary counts
  const pendingCount = deliveries.filter((d) => d.status === "Pending").length;
  const onWayCount = deliveries.filter((d) => d.status === "On the Way" || d.status === "Picked Up").length;
  const deliveredCount = deliveries.filter((d) => d.status === "Delivered").length;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Delivery System
      </h1>
      <p className="text-gray-600 mb-6">
        Assign drivers and track order deliveries in real time
      </p>

      {/* Summary Cards */}
      <div className="w-full max-w-lg grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-gray-700 text-2xl">{pendingCount}</p>
          <p className="text-gray-600 text-sm font-medium">Pending</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-yellow-700 text-2xl">{onWayCount}</p>
          <p className="text-yellow-600 text-sm font-medium">On the Way</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <p className="font-bold text-green-700 text-2xl">{deliveredCount}</p>
          <p className="text-green-600 text-sm font-medium">Delivered</p>
        </div>
      </div>

      {/* Assign Driver Form */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Assign Driver to Order
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Order
        </label>
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
        >
          <option value="">-- Select an order --</option>
          {getUnassignedOrders().map((order) => (
            <option key={order.id} value={order.id}>
              Order #{order.id.slice(-4)} — {order.date} — {order.total} Birr
            </option>
          ))}
        </select>

        {getUnassignedOrders().length === 0 && (
          <p className="text-gray-500 text-sm text-center mb-4 p-2 bg-gray-50 rounded">
            All orders have drivers assigned. Place new orders from Price List.
          </p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Driver Name
        </label>
        <input
          type="text"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. Abebe Kebede"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Driver Phone
        </label>
        <input
          type="text"
          value={driverPhone}
          onChange={(e) => setDriverPhone(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. 0911234567"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Estimated Delivery Time
        </label>
        <input
          type="text"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
          placeholder="e.g. 30 minutes / 2 hours"
        />

        <button
          onClick={handleAssignDriver}
          className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold"
        >
          Assign Driver
        </button>
      </div>

      {/* Deliveries List */}
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Active Deliveries ({deliveries.length})
        </h2>

        {deliveries.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              No deliveries yet. Assign a driver to an order above.
            </p>
          </div>
        )}

        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
          >
            {/* Delivery Header */}
            <div className={`p-3 flex justify-between items-center ${
              delivery.status === "Delivered"
                ? "bg-green-700"
                : "bg-blue-700"
            } text-white`}>
              <div>
                <p className="font-bold">
                  Order #{delivery.orderId.slice(-4)}
                </p>
                <p className="text-sm opacity-80">
                  {delivery.orderDate} — {delivery.total} Birr
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded font-bold ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
                <button
                  onClick={() => handleDelete(delivery.id)}
                  className="block mt-1 text-red-300 hover:text-red-100 text-xs ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pt-4">
              <div className="flex justify-between items-center mb-1">
                {["Pending", "Picked Up", "On the Way", "Delivered"].map(
                  (step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          getStatusStep(delivery.status) > i
                            ? "bg-green-500 text-white"
                            : getStatusStep(delivery.status) === i + 1
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center" style={{width: "60px"}}>
                        {step}
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(getStatusStep(delivery.status) / 4) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Driver Info */}
            <div className="px-4 pb-2">
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <p className="text-sm font-bold text-gray-900">
                  Driver: {delivery.driverName}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {delivery.driverPhone}
                </p>
                <p className="text-sm text-gray-600">
                  Estimated time: {delivery.estimatedTime}
                </p>
              </div>

              {/* Items */}
              <div className="mb-3">
                {delivery.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-900 mb-1">
                    <span className="capitalize font-medium">{item.name}</span>
                    <span>{item.quantity} kg — {item.quantity * item.price} Birr</span>
                  </div>
                ))}
              </div>

              {/* Update Status */}
              <div className="flex items-center gap-2 pb-4">
                <span className="text-sm text-gray-600 font-medium">
                  Update status:
                </span>
                <select
                  value={delivery.status}
                  onChange={(e) =>
                    handleStatusChange(
                      delivery.id,
                      e.target.value as any
                    )
                  }
                  className={`flex-1 p-1 rounded border text-sm font-bold ${getStatusColor(delivery.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="On the Way">On the Way</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}