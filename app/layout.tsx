import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";

export const metadata: Metadata = {
  title: "Hotel & Logistics Supply Chain Management",
  description: "Supply Chain Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}