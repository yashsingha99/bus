"use client";

import Hero from "@/components/Hero/Hero";
import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Footer from "@/components/footer";
import Head from "next/head";

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
      // console.log(res);
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


  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.OneSignal = window.OneSignal || [];
  //     window.OneSignal.push(function () {
  //       window.OneSignal.init({
  //         appId: "e6ef5a7f-7420-4583-a1e8-173f752ed0fc",
  //         notifyButton: {
  //           enable: true,
  //         },
  //         allowLocalhostAsSecureOrigin: true,
  //       });

  //       // Listen for subscription changes
  //       window.OneSignal.on("subscriptionChange", function (isSubscribed : boolean) {
  //         if (isSubscribed) {
  //           // Send a notification after subscription
  //           window.OneSignal.sendSelfNotification(
  //             "Welcome to Our Website!", // Notification title
  //             "Thanks for subscribing!", // Notification message
  //             "https://bustify.in", // URL to open on click
  //             // "https://yourwebsite.com/icon.png" // Icon for notification
  //           );
  //         }
  //       });
  //     });
  //   }
  // }, []);


// useEffect(() => {
//   // Only run if window is defined (avoids SSR issues)
//   if (typeof window !== "undefined") {
//     // Prevent multiple initializations
    
//     if (!window.OneSignalInitialized) {
//       window.OneSignal = window.OneSignal || [];
//       window.OneSignal.push(function () {
//         window.OneSignal.init({
//           appId: "e6ef5a7f-7420-4583-a1e8-173f752ed0fc",
//           notifyButton: {
//             enable: true,
//           },
//           allowLocalhostAsSecureOrigin: true, // good for local dev
//         });
//       });
//        window.OneSignal.on("subscriptionChange", function (isSubscribed) {
//          if (isSubscribed) {
//            // Send a notification after subscription
//            window.OneSignal.sendSelfNotification(
//              "Welcome to Our Website!", // Notification title
//              "Thanks for subscribing!", // Notification message
//              "https://yourwebsite.com", // URL to open on click
//              "https://yourwebsite.com/icon.png" // Icon for notification
//            );
//          }
//        });
//       window.OneSignalInitialized = true;
//     }
//   }

//   // No need to return cleanup unless you're hot reloading and want to reset OneSignal
// }, []);

  return (
    <>
    <Head>
      <title>Home | Bustify</title>
      <meta name="description" content="Home page of Bustify" />
      <meta property="og:title" content="Home | Bustify" />
      <meta property="og:description" content="Home page of Bustify" />
      <meta property="og:image" content="/preview.png" />
      <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://bustify.in/" />
      </Head>
      <Suspense fallback={<HomeSkeleton />}>
        <div className="w-full h-full flex items-center">
          <Hero />
        </div>
      <Footer />
    </Suspense>
    </>
  );
}
