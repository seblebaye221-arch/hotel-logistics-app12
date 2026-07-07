import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-800 text-white p-4 flex gap-4 items-center flex-wrap">
      <span className="font-bold text-lg mr-4">
        Hotel & Logistics
      </span>
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/hotel/login" className="hover:underline">Hotel Login</Link>
      <Link href="/logistics/login" className="hover:underline">Logistics Login</Link>
      <Link href="/logistics/add" className="hover:underline">Add Item</Link>
      <Link href="/menu" className="hover:underline text-yellow-300 font-bold">Price List</Link>
      <Link href="/inventory" className="hover:underline text-red-300 font-bold">Inventory</Link>
      <Link href="/orders" className="hover:underline text-green-300 font-bold">Order History</Link>
      <Link href="/suppliers" className="hover:underline text-pink-300 font-bold">Suppliers</Link>
      <Link href="/analytics" className="hover:underline text-cyan-300 font-bold">Analytics</Link>
      <Link href="/compare" className="hover:underline text-orange-300 font-bold">Compare</Link>
      <Link href="/delivery" className="hover:underline text-white bg-green-600 px-2 py-1 rounded font-bold">Delivery</Link>
      <Link href="/store" className="hover:underline text-white bg-purple-600 px-2 py-1 rounded font-bold">Online Store</Link>
      <Link href="/profile" className="hover:underline text-white bg-blue-600 px-2 py-1 rounded font-bold">Profile</Link>
    </nav>
  );
}