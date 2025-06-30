"use client";

import Hero from "@/components/Hero/Hero";
import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Footer from "@/components/footer";
import Head from "next/head";
// import meta from "next/meta"

// (window as any).OneSignalInitialized = true;

function HomeSkeleton() {
  return (
    <div className="w-full h-full flex items-center">
      <div className="container mx-auto">
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
    </div>
  );
}

export default function Home() {
  const fetchUser = async (userId: string) => {
    if (!userId) return;
    try {
      const res = await axios.get(`/api/User/${userId}`);
      if (res.data.status === 200) {
        const userD = {
          email: res.data.user.email,
          fullName: res.data.user.fullname,
          phone: res.data.user.phone,
          role: res.data.user.role,
          id: res.data.user._id,
        };
        localStorage.setItem("user", JSON.stringify(userD));
      }
    } catch (error: unknown) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      fetchUser(user.id);
    }
  }, []);


  return (
    <>
      <Head>
        <title>Home | Bustify | NPTEL BUS SERVICE</title>
        <meta name="description" content="Home page of Bustify" />
        <meta property="og:title" content="Home | Bustify" />
        <meta property="og:description" content="nptel bus service" />
        <meta property="og:image" content="/preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://bustify.in/" />
      </Head>

      <Suspense fallback={<HomeSkeleton />}>
        <div className="w-full h-full">
          <Hero />
        </div>
        <Footer />
      </Suspense>
    </>
  );
}