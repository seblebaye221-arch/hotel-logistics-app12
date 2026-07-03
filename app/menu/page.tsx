"use client";

import { useState, useEffect } from "react";

type MenuItem = {
  name: string;
  price: number;
};

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

const STORAGE_KEY = "logisticsItems";

export default function BuyerMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const items = JSON.parse(saved);
      setMenuItems(items.map((item: any) => ({
        name: item.name,
        price: item.price,
      })));
    }
  }, []);

  const handleQuantityChange = (name: string, value: number) => {
    setQuantities({ ...quantities, [name]: value });
  };

  const handleAddToOrder = (item: MenuItem) => {
    const qty = quantities[item.name] || 1;
    const existing = order.find((o) => o.name === item.name);
    if (existing) {
      setOrder(order.map((o) =>
        o.name === item.name
          ? { ...o, quantity: o.quantity + qty }
          : o
      ));
    } else {
      setOrder([...order, { ...item, quantity: qty }]);
    }
  };

  const grandTotal = order.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Price List
      </h1>
      <p className="text-gray-500 mb-6">
        Select items and quantity to place your order
      </p>

      <div className="w-full max-w-lg bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-700 text-white p-3 rounded-t-lg font-bold flex justify-between">
          <span>Item</span>
          <span>Price/kg</span>
          <span>Quantity</span>
          <span>Action</span>
        </div>

        {menuItems.length === 0 && (
          <p className="p-4 text-gray-400 text-center">
            No items available yet. Manager must add items first.
          </p>
        )}

        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 border-b"
          >
            <span className="capitalize font-medium w-24">{item.name}</span>
            <span className="text-green-700 font-bold w-24">
              {item.price} Birr/kg
            </span>
            <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) =>
                handleQuantityChange(item.name, Number(e.target.value))
              }
              className="w-16 p-1 border rounded text-center"
            />
            <button
              onClick={() => handleAddToOrder(item)}
              className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 text-sm"
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>

      {order.length > 0 && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            Your Order
          </h2>
          {order.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span className="capitalize">{item.name}</span>
              <span>
                {item.quantity} kg x {item.price} Birr ={" "}
                <strong>{item.quantity * item.price} Birr</strong>
              </span>
            </div>
          ))}
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-green-800">
            <span>Grand Total</span>
            <span>{grandTotal} Birr</span>
          </div>
          <button
            onClick={() => alert("Order placed successfully!")}
            className="w-full mt-4 bg-blue-700 text-white p-2 rounded hover:bg-blue-800"
          >
            Place Order
          </button>
        </div>
      )}
    </main>
  );
}