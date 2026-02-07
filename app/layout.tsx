import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Bowl LX Prop Sheet",
  description: "Official Prop Sheet for Super Bowl LX 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0e] text-gray-100 min-h-screen font-sans antialiased">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
