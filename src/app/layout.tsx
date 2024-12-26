'use client'

import "./globals.css"; // Global styles
import { DrawerProvider } from "@/context/DrawerContext"; // Drawer context provider
import Navbar from "@/components/Navbar"; // Navbar component
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* DrawerProvider wraps the app for global drawer state */}
        <DrawerProvider>
          <Navbar />
          <main>{children}</main>
        </DrawerProvider>
      </body>
    </html>
  );
}
