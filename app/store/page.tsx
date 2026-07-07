"use client";

import { useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  available: boolean;
  description: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Purchase = {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number; unit: string }[];
  total: number;
  status: "Processing" | "Confirmed" | "Shipped" | "Delivered";
};

const CART_KEY = "onlineCart";
const PURCHASES_KEY = "onlinePurchases";

// Pre-loaded online store products
const ONLINE_PRODUCTS: Product[] = [
  { id: "1", name: "Potato", category: "Vegetables", price: 18, unit: "kg", supplier: "Ethio Fresh Market", available: true, description: "Fresh potatoes from local farms" },
  { id: "2", name: "Tomato", category: "Vegetables", price: 25, unit: "kg", supplier: "Green Valley Supplier", available: true, description: "Ripe red tomatoes, grade A" },
  { id: "3", name: "Onion", category: "Vegetables", price: 15, unit: "kg", supplier: "Ethio Fresh Market", available: true, description: "Fresh white onions" },
  { id: "4", name: "Rice", category: "Grains", price: 45, unit: "kg", supplier: "Addis Food Store", available: true, description: "Premium long grain rice" },
  { id: "5", name: "Cooking Oil", category: "Oils", price: 120, unit: "liter", supplier: "Addis Food Store", available: true, description: "Pure sunflower cooking oil" },
  { id: "6", name: "Sugar", category: "Groceries", price: 55, unit: "kg", supplier: "Merkato Wholesale", available: true, description: "Refined white sugar" },
  { id: "7", name: "Flour", category: "Grains", price: 35, unit: "kg", supplier: "Merkato Wholesale", available: true, description: "All-purpose wheat flour" },
  { id: "8", name: "Milk", category: "Dairy", price: 25, unit: "liter", supplier: "Addis Dairy Farm", available: true, description: "Fresh pasteurized milk" },
  { id: "9", name: "Eggs", category: "Dairy", price: 8, unit: "piece", supplier: "Addis Dairy Farm", available: true, description: "Fresh farm eggs" },
  { id: "10", name: "Chicken", category: "Meat", price: 280, unit: "kg", supplier: "Premium Meat Co.", available: true, description: "Fresh whole chicken" },
  { id: "11", name: "Beef", category: "Meat", price: 450, unit: "kg", supplier: "Premium Meat Co.", available: true, description: "Fresh beef, boneless" },
  { id: "12", name: "Cleaning Soap", category: "Cleaning", price: 30, unit: "kg", supplier: "Clean Supply Co.", available: true, description: "Industrial cleaning soap" },
];

export default function OnlineStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    const savedPurchases = localStorage.getItem(PURCHASES_KEY);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
  }, []);

  const categories = ["All", ...Array.from(new Set(ONLINE_PRODUCTS.map((p) => p.category)))];

  const filteredProducts = ONLINE_PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    const existing = cart.find((c) => c.product.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((c) =>
        c.product.id === product.id
          ? { ...c, quantity: c.quantity + qty }
          : c
      );
    } else {
      updated = [...cart, { product, quantity: qty }];
    }
    setCart(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
    alert(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter((c) => c.product.id !== productId);
    setCart(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        price: c.product.price,
        unit: c.product.unit,
      })),
      total: cartTotal,
      status: "Processing",
    };

    const updated = [newPurchase, ...purchases];
    setPurchases(updated);
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(updated));

    // Also add to logistics items
    const savedItems = localStorage.getItem("logisticsItems");
    const existingItems = savedItems ? JSON.parse(savedItems) : [];
    const newItems = cart.map((c) => ({
      name: c.product.name,
      quantity: c.quantity,
      price: c.product.price,
      bestBefore: "",
    }));
    localStorage.setItem("logisticsItems", JSON.stringify([...existingItems, ...newItems]));

    setCart([]);
    localStorage.removeItem(CART_KEY);
    setShowCart(false);
    alert("Order placed successfully! Items added to your inventory.");
  };

  const handleStatusChange = (id: string, status: Purchase["status"]) => {
    const updated = purchases.map((p) =>
      p.id === id ? { ...p, status } : p
    );
    setPurchases(updated);
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(updated));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-gray-100 text-gray-700";
      case "Confirmed": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-yellow-100 text-yellow-700";
      case "Delivered": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Online Store
      </h1>
      <p className="text-gray-600 mb-4">
        Buy supplies online directly from verified suppliers
      </p>

      {/* Action Buttons */}
      <div className="w-full max-w-2xl flex gap-3 mb-6">
        <button
          onClick={() => { setShowCart(!showCart); setShowPurchases(false); }}
          className="flex-1 bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold relative"
        >
          Cart ({cart.length} items) — {cartTotal} Birr
        </button>
        <button
          onClick={() => { setShowPurchases(!showPurchases); setShowCart(false); }}
          className="flex-1 bg-green-700 text-white p-2 rounded hover:bg-green-800 font-bold"
        >
          My Purchases ({purchases.length})
        </button>
      </div>

      {/* Cart */}
      {showCart && (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Shopping Cart
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-bold text-gray-900">{item.product.name}</p>
                    <p className="text-gray-500 text-sm">{item.product.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {item.quantity} {item.product.unit} x {item.product.price} Birr = {item.quantity * item.product.price} Birr
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold text-green-800 mt-4 p-3 bg-green-50 rounded">
                <span>Total</span>
                <span>{cartTotal} Birr</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-4 bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold"
              >
                Place Order & Add to Inventory
              </button>
            </>
          )}
        </div>
      )}

      {/* Purchase History */}
      {showPurchases && (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            My Purchase History
          </h2>
          {purchases.length === 0 ? (
            <p className="text-gray-500 text-center">No purchases yet.</p>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg mb-3 overflow-hidden">
                <div className="bg-blue-700 text-white p-3 flex justify-between">
                  <div>
                    <p className="font-bold">Order #{purchase.id.slice(-4)}</p>
                    <p className="text-sm opacity-80">{purchase.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{purchase.total} Birr</p>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  {purchase.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-900 mb-1">
                      <span className="capitalize font-medium">{item.name}</span>
                      <span>{item.quantity} {item.unit} — {item.quantity * item.price} Birr</span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <select
                      value={purchase.status}
                      onChange={(e) => handleStatusChange(purchase.id, e.target.value as Purchase["status"])}
                      className={`text-sm px-2 py-1 rounded font-bold border ${getStatusColor(purchase.status)}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Search & Filter */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md mb-4 flex gap-3 flex-wrap">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 font-medium"
            placeholder="Search products or suppliers..."
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded text-gray-900 font-medium"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
          >
            <div className="bg-blue-700 text-white p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg capitalize">{product.name}</p>
                  <p className="text-blue-200 text-xs">{product.supplier}</p>
                </div>
                <span className="bg-white text-blue-700 px-2 py-1 rounded text-xs font-bold">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-green-700 text-lg">
                  {product.price} Birr/{product.unit}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                  In Stock
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  onChange={(e) =>
                    setQuantities({ ...quantities, [product.id]: Number(e.target.value) })
                  }
                  className="w-20 p-2 border border-gray-300 rounded text-gray-900 font-bold text-center"
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-700 text-white px-3 py-2 rounded hover:bg-blue-800 font-bold text-sm"
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