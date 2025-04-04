"use client";

import "./globals.css"; // Global styles
import { DrawerProvider } from "@/context/DrawerContext"; // Drawer context provider
import Navbar from "@/components/Navbar"; // Navbar component
import localFont from "next/font/local";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";

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
          {/* <header className="sticky flex justify-center  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container  flex h-16 items-center justify-between">
              <MainNav />
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </header> */}
        {/* </div> */}

          <main>{children}</main>
        </DrawerProvider>
      </body>
    </html>
  );
}
