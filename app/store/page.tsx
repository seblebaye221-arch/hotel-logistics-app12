"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/components/AuthContext";
import { createOrder, subscribeToMyOrders, updateOrderStatus, Order } from "@/lib/orders";
import { reduceStock, subscribeToInventory, InventoryItem } from "@/lib/inventory";

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

export default function Store() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qtyInputs, setQtyInputs] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [statusAlert, setStatusAlert] = useState<string | null>(null);
  const previousStatuses = useRef<Record<string, string>>({});
  const isFirstOrdersLoad = useRef(true);

  useEffect(() => {
    const unsubscribeInv = subscribeToInventory(setInventory);
    return () => unsubscribeInv();
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = subscribeToMyOrders(user.email, (orders) => {
      if (!isFirstOrdersLoad.current) {
        orders.forEach((order) => {
          const oldStatus = previousStatuses.current[order.id];
          if (oldStatus && oldStatus !== order.status) {
            const itemSummary = order.items.map((i) => i.itemName).join(", ");
            setStatusAlert(
              `📦 Your order (${itemSummary}) status changed: ${oldStatus} → ${order.status}`
            );
            setTimeout(() => setStatusAlert(null), 6000);
          }
        });
      }
      const statusMap: Record<string, string> = {};
      orders.forEach((o) => { statusMap[o.id] = o.status; });
      previousStatuses.current = statusMap;
      isFirstOrdersLoad.current = false;
      setMyOrders(orders);
    });
    return () => unsubscribe();
  }, [user?.email]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (product: InventoryItem) => {
    const qty = qtyInputs[product.name] || 1;
    setCart((prev) => {
      const existing = prev.find((c) => c.name === product.name);
      if (existing) {
        return prev.map((c) => (c.name === product.name ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { name: product.name, price: product.price, qty }];
    });
  };

  const handleCheckout = async () => {
    if (!user?.email || cart.length === 0) return;
    const items = cart.map((c) => ({ itemName: c.name, quantity: c.qty, price: c.price }));
    await createOrder(user.email, items, cartTotal, paymentMethod);
    for (const item of items) {
      await reduceStock(item.itemName, item.quantity);
    }
    setConfirmation(
      `✅ Payment sent (${paymentMethod})! Your order (${cartTotal} Birr) has reached Logistics.`
    );
    setTimeout(() => setConfirmation(null), 6000);
    setCart([]);
    setShowCart(false);
    setShowPurchases(true);
  };

  const filteredProducts = inventory.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
  );

  const statusColor: Record<string, string> = {
    Processing: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 relative">
      {confirmation && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-medium max-w-lg text-center">
          {confirmation}
        </div>
      )}
      {statusAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg font-medium max-w-lg text-center" style={{ marginTop: confirmation ? "4.5rem" : 0 }}>
          {statusAlert}
        </div>
      )}
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-1">Online Store</h1>
      <p className="text-gray-600 text-center mb-6">Buy supplies online directly from verified suppliers</p>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => { setShowCart(!showCart); setShowPurchases(false); }}
          className="bg-blue-700 text-white px-6 py-3 rounded font-bold hover:bg-blue-800"
        >
          Cart ({cartCount} items) — {cartTotal} Birr
        </button>
        <button
          onClick={() => { setShowPurchases(!showPurchases); setShowCart(false); }}
          className="bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-800"
        >
          My Purchases ({myOrders.length})
        </button>
      </div>

      {showCart && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Your Cart</h2>
          {cart.length === 0 && <p className="text-gray-500">Cart is empty.</p>}
          {cart.map((item) => (
            <div key={item.name} className="flex justify-between border-b py-2 text-gray-800">
              <span>{item.name} x {item.qty}</span>
              <span>{item.price * item.qty} Birr</span>
            </div>
          ))}
          {cart.length > 0 && (
            <>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border p-2 rounded text-gray-900"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money (telebirr)">Mobile Money (telebirr)</option>
                </select>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-blue-700 text-white py-2 rounded font-bold hover:bg-blue-800"
              >
                Checkout — {cartTotal} Birr
              </button>
            </>
          )}
        </div>
      )}

      {showPurchases && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">My Purchase History</h2>
          {myOrders.length === 0 && <p className="text-gray-500">No purchases yet.</p>}
          <div className="flex flex-col gap-4">
            {myOrders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="bg-blue-700 text-white p-3 flex justify-between">
                  <span className="font-bold">Order #{order.id.slice(0, 6).toUpperCase()}</span>
                  <span className="font-bold">{order.total} Birr</span>
                </div>
                <div className="p-3">
                  {order.items.map((it, idx) => (
                    <p key={idx} className="text-gray-800 text-sm">
                      {it.itemName} — {it.quantity} kg — {it.price * it.quantity} Birr
                    </p>
                  ))}
                  <p className="text-sm text-gray-500 mt-1">Payment: {order.paymentMethod}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
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
        </div>
      )}

      <div className="max-w-2xl mx-auto mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or suppliers..."
          className="w-full border p-2 rounded text-gray-900"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {filteredProducts.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center">No items in stock right now.</p>
        )}
        {filteredProducts.map((p) => (
          <div key={p.id} className="border rounded-lg overflow-hidden">
            <div className="bg-blue-700 text-white p-3 flex justify-between items-start">
              <p className="font-bold">{p.name}</p>
              <span className="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded">{p.stock} kg in stock</span>
            </div>
            <div className="p-4 bg-white">
              <p className="text-green-700 font-bold mb-3">{p.price} Birr/kg</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={p.stock}
                  value={qtyInputs[p.name] || 1}
                  onChange={(e) => setQtyInputs({ ...qtyInputs, [p.name]: Number(e.target.value) })}
                  className="w-16 border p-2 rounded text-gray-900"
                />
                <button
                  onClick={() => addToCart(p)}
                  className="flex-1 bg-blue-700 text-white py-2 rounded font-bold hover:bg-blue-800"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}