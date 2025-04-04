"use client";

import React, { useEffect, useState } from "react";
// import DestSearchForm from "./DestSearchForm";
import { motion } from "framer-motion";
import DestSearchForm from "./DestSearchForm";
import SearchCard from "../search-card";
import useScreenSize from "@/hooks/use-screen-size";
import Link from "next/link";
import { FeedbackButton } from "../ui/feedback-button";
import { Bus, Clock, CreditCard, MapPin, Search, Shield, Star, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "../ui/input";
function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useScreenSize()
  const images = [
    "https://sa.adanione.com/-/media/Project/Campaigns/Valentine-s-Day/Offers/IDBI-OFFER/BUS_IDBIRIDE/AdaniOne_Web_CategoryLandingPage_Bus_Flat50--6.jpg",
    "https://th.bing.com/th/id/OIP.4i0AkXXTgi84QEugP2DjxQHaEJ?rs=1&pid=ImgDetMain",
    "https://sa.adanione.com/-/media/Project/Campaigns/Valentine-s-Day/Offers/IDBI-OFFER/BUS_IDBIRIDE/AdaniOne_Web_CategoryLandingPage_Bus_Flat50--6.jpg",
    "https://img.freepik.com/premium-photo/3d-rendering-plane-flying-suitcases-map-boarding-pass-with-cloud-pink-background-travelling-abroad-vacation-concept_625883-895.jpg"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, images.length]);

  return (
    // <div className="w-full">
    //   <motion.div
    //     // initial={{ opacity: 0, scale: 0.8 }}
    //     whileInView={{ opacity: 1, scale: 1 }}
    //     transition={{ duration: 6 }}
    //     viewport={{ once: true }}
    //     className="order-1 lg:order-2"
    //   >
    //     <div className="  w-full relative   -z-1 sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden shadow-xl">
    //       <div
    //         className="flex  h-full transition-transform duration-1000 ease-in-out"
    //         style={{
    //           transform: `translateX(-${currentIndex * 100}%)`,
    //         }}
    //       >
    //         {images.map((img, index) => (
    //           <img
    //             key={index}
    //             src={img}
    //             className="flex-shrink-0 w-full h-full transition-opacity duration-1000"
    //           />
              
    //         ))}
    //       </div>

    //       <SearchCard />

    //       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
    //         {images.map((_, index) => (
    //           <button
    //             key={index}
    //             onClick={() => setCurrentIndex(index)}
    //             className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
    //               currentIndex === index
    //                 ? "bg-white scale-125 shadow-lg"
    //                 : "bg-white/50 hover:bg-white/75"
    //             }`}
    //             aria-label={`Go to slide ${index + 1}`}
    //           />
    //         ))}
    //       </div>
    //     </div>
    //   </motion.div>
    // </div>
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
              {/* <div className="flex items-center justify-center">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Quick Search</CardTitle>
                    <CardDescription>Find buses for your journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="one-way" className="w-full">
                      <Tabs className="grid w-full grid-cols-2">
                        <TabsTrigger value="one-way">One Way</TabsTrigger>
                        <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
                      </Tabs>
                      <TabsContent value="one-way" className="space-y-4">
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="from"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                From
                              </label>
                              <Input id="from" placeholder="Departure City" />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="to"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                To
                              </label>
                              <Input id="to" placeholder="Arrival City" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="date"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Date of Journey
                            </label>
                            <Input id="date" type="date" />
                          </div>
                          <FeedbackButton className="w-full">
                            Search Buses
                            <Search className="ml-2 h-4 w-4" />
                          </FeedbackButton>
                        </div>
                      </TabsContent>
                      <TabsContent value="round-trip" className="space-y-4">
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="from-rt"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                From
                              </label>
                              <Input id="from-rt" placeholder="Departure City" />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="to-rt"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                To
                              </label>
                              <Input id="to-rt" placeholder="Arrival City" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="depart-date"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Departure Date
                              </label>
                              <Input id="depart-date" type="date" />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="return-date"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Return Date
                              </label>
                              <Input id="return-date" type="date" />
                            </div>
                          </div>
                          <FeedbackButton className="w-full">
                            Search Buses
                            <Search className="ml-2 h-4 w-4" />
                          </FeedbackButton>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div> */}
              <SearchCard />
            </div>
          </div>
        </section>
        {/* <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes bus booking simple and convenient for everyone
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Search</h3>
                <p className="text-muted-foreground">
                  Find buses based on your preferences for comfort, timing, and price.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Book & Pay</h3>
                <p className="text-muted-foreground">Secure online booking and payment for single or multiple seats.</p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Track & Travel</h3>
                <p className="text-muted-foreground">
                  Get real-time updates and track your bus location during your journey.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">For Everyone</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform serves passengers, bus owners, and administrators
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 p-2 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <CardTitle className="mt-4">Passengers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>Search for buses with filters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Book multiple seats easily</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Track bus location in real-time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Get real-time notifications</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/passenger/register" className="w-full">
                    <FeedbackButton variant="outline" className="w-full">
                      Register as Passenger
                    </FeedbackButton>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 p-2 text-primary">
                    <Bus className="h-4 w-4" />
                  </div>
                  <CardTitle className="mt-4">Bus Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-muted-foreground" />
                      <span>Register buses with details</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>Create special offers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>View live booking statistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Manage schedules and pricing</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/owner/register" className="w-full">
                    <FeedbackButton variant="outline" className="w-full">
                      Register as Bus Owner
                    </FeedbackButton>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 p-2 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <CardTitle className="mt-4">Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Manage users and bus owners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-muted-foreground" />
                      <span>Monitor all buses and bookings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>View platform statistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Ensure platform security</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/login" className="w-full">
                    <FeedbackButton variant="outline" className="w-full">
                      Admin Login
                    </FeedbackButton>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section> */}
      </main>
  );
}

export default Hero;
