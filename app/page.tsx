import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-700">
        Hotel & Logistics System
      </h1>
      <p className="mt-4 text-gray-600 mb-8">
        Welcome! Choose where you'd like to go:
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/hotel/login"
          className="text-center bg-blue-700 text-white p-3 rounded hover:bg-blue-800"
        >
          Hotel Login
        </Link>

        <Link
          href="/logistics/login"
          className="text-center bg-green-700 text-white p-3 rounded hover:bg-green-800"
        >
          Logistics Login
        </Link>

        <Link
          href="/logistics/add"
          className="text-center bg-gray-700 text-white p-3 rounded hover:bg-gray-800"
        >
          Add Item (Logistics)
        </Link>
      </div>
    </main>
  );
}