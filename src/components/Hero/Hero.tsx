"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CreditCard,
  Search,
  Users,
  MoveRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import SearchCard from "../search-card";
import { FeedbackButton } from "../ui/feedback-button";

// function HeroSkeleton() {
//   return (
//     <main className="flex-1">
//       <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
//         <div className="container px-4 md:px-6">
//           <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
//             <div className="flex flex-col justify-center space-y-4">
//               <div className="space-y-2">
//                 <Skeleton className="h-12 w-3/4" />
//                 <Skeleton className="h-6 w-full" />
//                 <Skeleton className="h-6 w-5/6" />
//               </div>
//               <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                 <Skeleton className="h-10 w-full" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//             </div>
//             <div className="space-y-4">
//               <Skeleton className="h-[400px] w-full rounded-lg" />
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

function Hero() {
  const [isSearch, setIsSearch] = useState(false);

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Book Your Bus Journey with Ease
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Find, book, and track buses in real-time. Enjoy a seamless
                  travel experience with our modern booking platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/searchBus">
                  <FeedbackButton onClick={() => setIsSearch(true)} className="w-full">
                    {!isSearch ? "Book Your Seat" : "Executing..."}
                    <MoveRight className="ml-2 h-4 w-4" />
                  </FeedbackButton>
                </Link>
              </div>
            </div>
            <SearchCard />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Why Choose Us
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience the best bus booking platform with our unique features
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track your bus location in real-time and get updates about
                  delays or changes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multiple payment options with secure gateway integration for
                  your peace of mind.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Group Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Book multiple seats easily with special group discounts and
                  offers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple steps to book your journey
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Search</h3>
              <p className="text-sm text-muted-foreground">
                Enter your journey details and find available buses
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Select</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred bus and seats
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Book</h3>
              <p className="text-sm text-muted-foreground">
                Complete your booking with secure payment
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <h3 className="text-xl font-bold">Travel</h3>
              <p className="text-sm text-muted-foreground">
                Board your bus and enjoy your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Travel?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start your journey today with our easy booking process
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/searchBus">
                <FeedbackButton className="w-full">
                  Book Now
                  <Search className="ml-2 h-4 w-4" />
                </FeedbackButton>
              </Link>
              <Link href="/about">
                <FeedbackButton variant="outline" className="w-full">
                  Learn More
                </FeedbackButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
