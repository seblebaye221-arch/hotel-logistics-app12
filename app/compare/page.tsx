"use client";

import { useState, useEffect } from "react";

type Supplier = {
  id: string;
  name: string;
  products: string;
  status: string;
  type: string;
};

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type SupplierPrice = {
  supplierName: string;
  supplierStatus: string;
  price: number;
};

type ComparisonItem = {
  itemName: string;
  prices: SupplierPrice[];
  cheapest: SupplierPrice | null;
  mostExpensive: SupplierPrice | null;
  savings: number;
};

export default function CostComparison() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [supplierPrices, setSupplierPrices] = useState<{[key: string]: string}>({});
  const [saved, setSaved] = useState(false);

  const COMPARISON_KEY = "supplierComparisons";

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    const savedItems = localStorage.getItem("logisticsItems");
    const savedComparisons = localStorage.getItem(COMPARISON_KEY);

    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedComparisons) setComparisons(JSON.parse(savedComparisons));
  }, []);

  const handleAddComparison = () => {
    if (!selectedItem) {
      alert("Please select an item to compare.");
      return;
    }

    const prices: SupplierPrice[] = suppliers
      .filter((s) => supplierPrices[s.id] && Number(supplierPrices[s.id]) > 0)
      .map((s) => ({
        supplierName: s.name,
        supplierStatus: s.status,
        price: Number(supplierPrices[s.id]),
      }));

    if (prices.length < 2) {
      alert("Please enter prices for at least 2 suppliers to compare.");
      return;
    }

    const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
    const cheapest = sortedPrices[0];
    const mostExpensive = sortedPrices[sortedPrices.length - 1];
    const savings = mostExpensive.price - cheapest.price;

    const newComparison: ComparisonItem = {
      itemName: selectedItem,
      prices,
      cheapest,
      mostExpensive,
      savings,
    };

    const existing = comparisons.filter((c) => c.itemName !== selectedItem);
    const updated = [newComparison, ...existing];
    setComparisons(updated);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(updated));

    setSelectedItem("");
    setSupplierPrices({});
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (itemName: string) => {
    const updated = comparisons.filter((c) => c.itemName !== itemName);
    setComparisons(updated);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(updated));
  };

  const totalSavings = comparisons.reduce((sum, c) => sum + c.savings, 0);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Cost Comparison
      </h1>
      <p className="text-gray-600 mb-6">
        Compare supplier prices and find the best deal for each item
      </p>

      {/* Summary */}
      {comparisons.length > 0 && (
        <div className="w-full max-w-lg grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
            <p className="font-bold text-blue-700 text-2xl">{comparisons.length}</p>
            <p className="text-blue-600 text-sm font-medium">Items Compared</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center shadow">
            <p className="font-bold text-green-700 text-2xl">{totalSavings} Birr</p>
            <p className="text-green-600 text-sm font-medium">Total Possible Savings/kg</p>
          </div>
        </div>
      )}

      {/* Add Comparison Form */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Add Price Comparison
        </h2>

        {/* Select Item */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Item to Compare
        </label>
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 font-medium"
        >
          <option value="">-- Select an item --</option>
          {items.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name} (current: {item.price} Birr/kg)
            </option>
          ))}
        </select>

        {/* Enter price for each supplier */}
        {suppliers.length === 0 ? (
          <p className="text-gray-500 text-center p-3 bg-gray-50 rounded">
            No suppliers found. Add suppliers first from the Suppliers page.
          </p>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter price (Birr/kg) for each supplier:
            </label>
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{supplier.name}</p>
                  <p className="text-gray-500 text-xs">{supplier.products}</p>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    value={supplierPrices[supplier.id] || ""}
                    onChange={(e) =>
                      setSupplierPrices({
                        ...supplierPrices,
                        [supplier.id]: e.target.value,
                      })
                    }
                    className="w-24 p-2 border border-gray-300 rounded text-gray-900 font-medium text-center"
                    placeholder="0"
                  />
                  <span className="text-gray-600 text-sm">Birr</span>
                </div>
              </div>
            ))}
          </>
        )}

        {saved && (
          <p className="text-green-600 font-medium mb-3">
            Comparison saved successfully!
          </p>
        )}

        <button
          onClick={handleAddComparison}
          className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 font-bold mt-2"
        >
          Compare Prices
        </button>
      </div>

      {/* Comparison Results */}
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Comparison Results ({comparisons.length})
        </h2>

        {comparisons.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              No comparisons yet. Add a comparison above.
            </p>
          </div>
        )}

        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-700 text-white p-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg capitalize">
                  {comparison.itemName}
                </p>
                <p className="text-blue-200 text-sm">
                  Best: {comparison.cheapest?.supplierName} at{" "}
                  {comparison.cheapest?.price} Birr/kg
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-300 font-bold">
                  Save {comparison.savings} Birr/kg
                </p>
                <button
                  onClick={() => handleDelete(comparison.itemName)}
                  className="text-red-300 hover:text-red-100 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Price Bars */}
            <div className="p-4">
              {comparison.prices
                .sort((a, b) => a.price - b.price)
                .map((sp, i) => {
                  const isCheapest = sp.supplierName === comparison.cheapest?.supplierName;
                  const maxPrice = Math.max(...comparison.prices.map((p) => p.price));
                  return (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {sp.supplierName}
                          </span>
                          {isCheapest && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-bold">
                              Best Deal!
                            </span>
                          )}
                          <span className={`text-xs px-1 rounded ${
                            sp.supplierStatus === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {sp.supplierStatus}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {sp.price} Birr/kg
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-5">
                        <div
                          className={`h-5 rounded-full ${
                            isCheapest ? "bg-green-500" : "bg-blue-400"
                          }`}
                          style={{
                            width: `${(sp.price / maxPrice) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

              {/* Recommendation */}
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-bold text-sm">
                  Recommendation: Order {comparison.itemName} from{" "}
                  {comparison.cheapest?.supplierName}
                </p>
                <p className="text-green-600 text-xs mt-1">
                  You save {comparison.savings} Birr per kg compared to{" "}
                  {comparison.mostExpensive?.supplierName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}