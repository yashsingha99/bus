"use client";

import "./globals.css"; // Global styles
import { DrawerProvider } from "@/context/DrawerContext"; // Drawer context provider
import Navbar from "@/components/Navbar"; // Navbar component
import localFont from "next/font/local";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { ClerkProvider } from "@clerk/nextjs";
import RouteGuard from "@/components/RouteGuard";
import SignUpRedirect from "@/components/SignUpRedirect";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <DrawerProvider>
            <Navbar />
            <SignUpRedirect />
            <RouteGuard>
              <main>{children}</main>
            </RouteGuard>
          </DrawerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
