import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-800 text-white p-4 flex gap-4 items-center">
      <span className="font-bold text-lg mr-4">
        Hotel & Logistics
      </span>
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <Link href="/hotel/login" className="hover:underline">
        Hotel Login
      </Link>
      <Link href="/logistics/login" className="hover:underline">
        Logistics Login
      </Link>
      <Link href="/logistics/add" className="hover:underline">
        Add Item
      </Link>
    </nav>
  );
}