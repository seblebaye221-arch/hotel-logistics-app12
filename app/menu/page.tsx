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
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  const minPrice = menuItems.length > 0
    ? Math.min(...menuItems.map((item) => item.price))
    : null;

  // Filter items based on search and max price
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = maxPrice === "" || item.price <= Number(maxPrice);
    return matchesSearch && matchesPrice;
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Price List
      </h1>
      <p className="text-gray-600 mb-6">
        Search and order items from our supply list
      </p>

      {/* Search & Filter Bar */}
      <div className="w-full max-w-lg bg-white p-4 rounded-lg shadow-md mb-4 flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Search by name
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 font-medium"
            placeholder="e.g. Potato"
          />
        </div>
        <div className="w-36">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Max Price (Birr)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 font-medium"
            placeholder="e.g. 50"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => { setSearch(""); setMaxPrice(""); }}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="w-full max-w-lg mb-2">
        <p className="text-gray-600 text-sm">
          Showing <strong>{filteredItems.length}</strong> of <strong>{menuItems.length}</strong> items
          {search && <span> matching "<strong>{search}</strong>"</span>}
          {maxPrice && <span> under <strong>{maxPrice} Birr/kg</strong></span>}
        </p>
      </div>

      {/* Price List Table */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-700 text-white p-3 rounded-t-lg font-bold flex justify-between">
          <span className="w-28">Item</span>
          <span className="w-28">Price/kg</span>
          <span className="w-16 text-center">Qty</span>
          <span>Action</span>
        </div>

        {filteredItems.length === 0 && (
          <p className="p-4 text-gray-600 text-center font-medium">
            No items found matching your search.
          </p>
        )}

        {filteredItems.map((item, index) => {
          const isBestDeal = item.price === minPrice;
          return (
            <div
              key={index}
              className={`flex justify-between items-center p-3 border-b ${
                isBestDeal ? "bg-green-50 border-l-4 border-l-green-500" : ""
              }`}
            >
              <div className="w-28">
                <span className="capitalize font-bold text-gray-900">
                  {item.name}
                </span>
                {isBestDeal && (
                  <span className="ml-1 text-xs bg-green-500 text-white px-1 py-0.5 rounded font-bold">
                    Best Deal!
                  </span>
                )}
              </div>
              <span className="text-green-700 font-bold w-28">
                {item.price} Birr/kg
              </span>
              <input
                type="number"
                min="1"
                defaultValue="1"
                onChange={(e) =>
                  handleQuantityChange(item.name, Number(e.target.value))
                }
                className="w-16 p-1 border border-gray-400 rounded text-center text-gray-900 font-bold"
              />
              <button
                onClick={() => handleAddToOrder(item)}
                className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 text-sm font-medium"
              >
                Add to Order
              </button>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      {order.length > 0 && (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Your Order
          </h2>
          {order.map((item, index) => (
            <div key={index} className="flex justify-between mb-2 text-gray-900">
              <span className="capitalize font-medium">{item.name}</span>
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
            onClick={() => {
              const newOrder = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                items: order,
                total: grandTotal,
              };
              const existing = localStorage.getItem("orderHistory");
              const history = existing ? JSON.parse(existing) : [];
              localStorage.setItem("orderHistory", JSON.stringify([newOrder, ...history]));
              alert("Order placed successfully!");
              setOrder([]);
            }}
            className="w-full mt-4 bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold"
          >
            Place Order
          </button>
        </div>
      )}
    </main>
  );
}