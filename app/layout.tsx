import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SimpleWebAuthn Demo",
  description: "SimpleWebAuthn Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>SimpleWebAuthn Demo</title>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
