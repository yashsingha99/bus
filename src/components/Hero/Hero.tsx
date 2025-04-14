"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, CreditCard, Search, Users, MoveRight, ArrowRightCircle, MapPin, Bus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SearchCard from "../search-card";
import { FeedbackButton } from "../ui/feedback-button";
import { useRouter } from "next/navigation";

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
   const router = useRouter();
  return (
    <main className="flex-1">
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes subtle-zoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 15s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 bg-muted relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-0 lg:w-72 lg:h-72 md:w-60 md:h-60 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 lg:w-72 lg:h-72 md:w-60 md:h-60 w-20 h-20 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 lg:w-72 lg:h-72 md:w-60 md:h-60 w-20 h-20 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center max-w-7xl">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-gradient">
                  Book Your Bus Journey with Ease
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0 animate-fade-in-up">
                  Find, book, and track buses in real-time. Enjoy a seamless
                  travel experience with our modern booking platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start animate-fade-in-up">
                <Link href="/searchBus">
                  <FeedbackButton
                    onClick={() =>{ setIsSearch(true); router.push('/searchBus')}}
                    className="w-full group relative overflow-hidden px-6 py-3 transition-all duration-300 ease-out hover:scale-105"
                  >
                    <span className="relative z-10">
                      {!isSearch ? "Book Your Seat" : "Executing..."}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-600/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                    <MoveRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
                  </FeedbackButton>
                </Link>
              </div>
            </div>
            <SearchCard />
          </div>
        </div>
      </section>
      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          
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
                  <FeedbackButton
                    onClick={() => setIsSearch(true)}
                    className="w-full"
                  >
                    {!isSearch ? "Book Your Seat" : "Executing..."}
                    <MoveRight className="ml-2 h-4 w-4" />
                  </FeedbackButton>
                </Link>
              </div>
            </div>
            <SearchCard />
          </div>
        </div>
      </section> */}

      <section className="w-full inset-0 rounded-4xl py-12  md:py-24 lg:py-32 relative overflow-hidden backdrop-blur-sm">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-10 z-0 transform scale-105 animate-subtle-zoom"
          style={{
            backgroundImage: "url('/image/set.jpg')",
          }}
        ></div>

        <div className="container px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Why Choose Us
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience the best bus booking platform with our unique
                features
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <Card className="group bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                  Real-time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Track your bus location in real-time and get updates about
                  delays or changes.
                </p>
              </CardContent>
            </Card>
            <Card className="group bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <CreditCard className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                  Secure Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Multiple payment options with secure gateway integration for
                  your peace of mind.
                </p>
              </CardContent>
            </Card>
            <Card className="group bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                  Group Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Book multiple seats easily with special group discounts and
                  offers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mb-12 md:mb-20">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <div className="rounded-full bg-primary/20 p-1">
                <Bus className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-3">
              Your Journey <span className="text-primary">Simplified</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
              Book your perfect bus trip in just four easy steps
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
              <div className="flex flex-col items-center group">
                <div className="flex mb-6 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  Search
                </h3>
                <p className="text-muted-foreground text-center">
                  Enter your destination and travel dates to discover available
                  routes
                </p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="flex mb-6 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bus className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  Select
                </h3>
                <p className="text-muted-foreground text-center">
                  Browse options and choose your perfect bus and preferred
                  seating
                </p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="flex mb-6 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  Book
                </h3>
                <p className="text-muted-foreground text-center">
                  Complete your reservation with our secure, hassle-free payment
                  system
                </p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="flex mb-6 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  Travel
                </h3>
                <p className="text-muted-foreground text-center">
                  Receive your e-ticket, board with ease, and enjoy your
                  comfortable journey
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12 md:mt-16">
            <button
              onClick={() => router.push("/searchBus")}
              className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Plan Your Trip Now
              <ArrowRightCircle className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
