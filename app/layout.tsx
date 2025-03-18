import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "세종 말하기 (Sejong Malhagi) - Korean Pronunciation Practice",
  description:
    "Practice Korean pronunciation rules like liquidization and nasalization with interactive exercises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                세종 말하기
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/practice/nasalization"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Nasalization
                </Link>
                <Link
                  href="/practice/liquidization"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Liquidization
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
