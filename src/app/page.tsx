"use client"

import ClientFeedback from "@/components/ClientFeedback";
import Hero from "@/components/Hero/Hero";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <div className="w-full h-full flex items-center">
        <Hero />
      </div>
    </Suspense>
  );
}
