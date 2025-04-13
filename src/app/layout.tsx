"use client";

import "./globals.css"; // Global styles
import { DrawerProvider } from "@/context/DrawerContext"; // Drawer context provider
import Navbar from "@/components/Navbar"; // Navbar component
// import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
// import RouteGuard from "@/components/RouteGuard";
import SignUpRedirect from "@/components/SignUpRedirect";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
//   display: "swap",
// });

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
//   display: "swap",
// });

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: {
//     default: "Bustify - Book Bus Tickets Online | Fast & Easy Bus Booking",
//     template: "%s | Bustify"
//   },
//   description: "Book bus tickets online with Bustify. Compare prices with Abhibus, Redbus, and other bus booking platforms. Fast, easy, and secure bus ticket booking for all major routes.",
//   keywords: [
//     "bustify.in",
//     "busify",
//     "busify.in",
//     "bus.in",
//     "bus.com",
//     "bus.com.in",
//     "bus.com.in",
//     "bus.com.in",
//     "bus.com.in",
//     "bus.com.in",
//     "bus tickets",
//     "online bus booking",
//     "bus travel",
//     "bus reservation",
//     "bus tickets online",
//     "bustify",
//     "abhibus",
//     "redbus",
//     "greenbus",
//     "blackbus",
//     "fast bus booking",
//     "air conditioned bus",
//     "luxury bus booking",
//     "sleeper bus booking",
//     "bus ticket price",
//     "bus schedule",
//     "bus routes",
//     "bus timings",
//     "bus booking app",
//     "bus booking website",
//     "bus booking platform",
//     "bus booking service",
//     "bus booking system",
//     "bus booking software",
//     "bus booking application",
//     "bus booking website",
//     "bus booking platform",
//     "NPTEL bus booking",
//     "NPTEL bus ticket booking",
//     "NPTEL bus schedule",
//     "NPTEL bus routes",
//     "NPTEL bus timings",
//     "NPTEL bus ticket price",
//     "NPTEL bus booking website",
//     "NPTEL bus booking platform",
//     "NPTEL bus booking service",
//     "NPTEL bus booking system",
//     "NPTEL bus booking software",
//     "NPTEL bus booking application",
//     "nptel bus booking",
//     "nptel bus ticket booking",
//     "nptel bus schedule",
//     "nptel bus routes",
//     "nptel bus timings",
//     "nptel bus ticket price",
//   ],
//   authors: [{ name: "Bustify" }],
//   creator: "Bustify",
//   publisher: "Bustify",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   metadataBase: new URL('https://www.bustify.in'),
//   alternates: {
//     canonical: '/',
//   },
//   openGraph: {
//     title: "Bustify - Book Bus Tickets Online | Fast & Easy Bus Booking",
//     description: "Book bus tickets online with Bustify. Compare prices with Abhibus, Redbus, and other bus booking platforms. Fast, easy, and secure bus ticket booking for all major routes.",
//     url: 'https://www.bustify.in',
//     siteName: 'Bustify',
//     images: [
//       {
//         url: '/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Bustify - Book Bus Tickets Online',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: "Bustify - Book Bus Tickets Online | Fast & Easy Bus Booking",
//     description: "Book bus tickets online with Bustify. Compare prices with Abhibus, Redbus, and other bus booking platforms. Fast, easy, and secure bus ticket booking for all major routes.",
//     images: ['/twitter-image.jpg'],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
//   verification: {
//     google: 'your-google-verification-code',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <DrawerProvider>
            <Navbar />
            <SignUpRedirect />
            {/* <RouteGuard> */}
              <main>{children}</main>
            {/* </RouteGuard> */}
          </DrawerProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
