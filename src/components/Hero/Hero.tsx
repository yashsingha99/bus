"use client";

import React, { useEffect, useState } from "react";
// import DestSearchForm from "./DestSearchForm";
import { motion } from "framer-motion";
import SearchCard from "../search-card";
import useScreenSize from "@/hooks/use-screen-size";
import Link from "next/link";
import { FeedbackButton } from "../ui/feedback-button";
import { Bus, Clock, CreditCard, MapPin, Search, Shield, Star, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "../ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useScreenSize();
  const images = [
    "https://sa.adanione.com/-/media/Project/Campaigns/Valentine-s-Day/Offers/IDBI-OFFER/BUS_IDBIRIDE/AdaniOne_Web_CategoryLandingPage_Bus_Flat50--6.jpg",
    "https://th.bing.com/th/id/OIP.4i0AkXXTgi84QEugP2DjxQHaEJ?rs=1&pid=ImgDetMain",
    "https://sa.adanione.com/-/media/Project/Campaigns/Valentine-s-Day/Offers/IDBI-OFFER/BUS_IDBIRIDE/AdaniOne_Web_CategoryLandingPage_Bus_Flat50--6.jpg",
    "https://img.freepik.com/premium-photo/3d-rendering-plane-flying-suitcases-map-boarding-pass-with-cloud-pink-background-travelling-abroad-vacation-concept_625883-895.jpg"
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, images.length]);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Book Your Bus Journey with Ease
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Find, book, and track buses in real-time. Enjoy a seamless travel experience with our modern booking
                  platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/search">
                  <FeedbackButton className="w-full">
                    Search Buses
                    <Search className="ml-2 h-4 w-4" />
                  </FeedbackButton>
                </Link>
                <Link href="/register">
                  <FeedbackButton variant="outline" className="w-full">
                    Register as Bus Owner
                  </FeedbackButton>
                </Link>
              </div>
            </div>
            <SearchCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Us</h2>
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
                  Track your bus location in real-time and get updates about delays or changes.
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
                  Multiple payment options with secure gateway integration for your peace of mind.
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
                  Book multiple seats easily with special group discounts and offers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
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

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Travel?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start your journey today with our easy booking process
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/search">
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

function HeroSkeleton() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-32 mt-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-2 text-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
