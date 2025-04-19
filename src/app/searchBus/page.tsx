"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ITrip } from "@/model/trip.model";
import { formatPrice } from "@/utils/priceUtils";
import { Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import Head from "next/head";

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted"></div>
      </div>

      <div className="mb-6 h-10 w-full animate-pulse rounded-md bg-muted"></div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-4 h-48 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="mb-2 h-6 w-3/4 animate-pulse rounded-md bg-muted"></div>
            <div className="mb-4 h-4 w-1/2 animate-pulse rounded-md bg-muted"></div>

            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
              <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
            </div>

            <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusSearchPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<ITrip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrips, setFilteredTrips] = useState<ITrip[]>([]);

  //-------------------------------------- FETCH TRIP DATA ----------------------------------------------
  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const res = await tripApi.getAllTrips();
      // console.log(res);

      // Filter out expired trips
      const filteredTrips = res
        .map((trip) => ({
          ...trip,
          Trips: trip.Trips.filter((t) => t.Status !== "Expiry"),
        }))
        .filter((trip) => trip.Trips.length > 0) as ITrip[];

      setTripData(filteredTrips);
      setFilteredTrips(filteredTrips);
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      setTripData([]);
      setFilteredTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  //------------------------------------- FETCH TRIP DATA BY PAGE LOAD  ---------------------------------
  useEffect(() => {
    fetchTrips();
  }, []);

  //------------------------------------- FILTER TRIPS BY SEARCH QUERY  ---------------------------------
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTrips(tripData);
    } else {
      const filtered = tripData.filter((trip) =>
        trip.destinationAddress
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
    }
  }, [searchQuery, tripData]);

  //--------------------------- LOADING SKELETON -----------------------------
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  //--------------------------- NO TRIPS FOUND -----------------------------
  if (tripData.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No trips available</h3>
              <p className="text-muted-foreground">
                There are no bus trips available at the moment
              </p>
              <Link href="/">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  //--------------------------- RETURN JSX -----------------------------
  return (
    <>
      <Head>
        <title>Search Bus | Bustify</title>
        <meta name="description" content="Search for your bus trip here." />
        <meta property="og:title" content="Search Bus | Bustify" />
        <meta
          property="og:description"
          content="Search for your bus trip here."
        />
        <meta property="og:image" content="/preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* Add canonical URL too */}
        <link rel="canonical" href="https://bustify.in/searchBus" />
      </Head>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Toaster />
        <Input
          placeholder="Search Your Trip"
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full mb-6"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip, index) => {
            const nextTrip = trip.Trips; // Show only the first available trip
            return (
              <Card
                key={index}
                className="overflow-hidden border border-blue-800"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base truncate">
                      {trip.destinationAddress}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-green-700">
                    {trip.Trips.length} trips available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                   <Calendar className="h-4 w-4 text-muted-foreground" />
                     {nextTrip &&
                    nextTrip.map((nexttrip, idx) => (
                      <div className="flex items-center gap-2 text-sm" key={idx}>
                        {new Date(nexttrip.date).toLocaleDateString("en-US", {
                          // weekday: "short",
                          month: "short",
                          day: "numeric",
                        })},{" "}
                      </div>
                    ))}
                  </div>
                 
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {trip.Trips[0]?.Timing.slice(0, 3).map((time, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          {time}
                        </span>
                      ))}
                      {trip.Trips[0].Timing.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{trip.Trips[0]?.Timing.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-lg text-blue-800 font-semibold">
                    {formatPrice({
                      price: trip.Trips[0].price,
                      currency: "INR",
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full text-sm"
                    onClick={() =>
                      router.push(`/searchBus/source?destination=${trip._id}`)
                    }
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredTrips.length === 0 && (
          <div className="mt-8 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No trips found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </>
  );
}
