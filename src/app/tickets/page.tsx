"use client";

import { useEffect, useState, useCallback } from "react";
// import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Auth from "@/components/model/auth";
// import { format } from "date-fns";

interface Ticket {
  _id: string;
  trip: {
    _id: string;
    busNumber: string;
    departureTime: string;
    arrivalTime: string;
  };
  destination: {
    _id: string;
    name: string;
    destinationAddress: string;
    Trips: Array<{
      _id: string;
      date: string;
      Timing: string[];
      price: number;
      SeatsLimit: number;
    }>;
  };
  pickupAddress: string;
  time: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  passengerDetails: Array<{
    name: string;
    age: number;
    gender: string;
  }>;
  createdAt: string;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role?: string;
}

export default function TicketsPage() {
  // const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;
      setUser(userData);
    }
  }, []);
  const fetchTickets = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/passanger/booking?userId=${user.id}`
      );
      setTickets(response.data.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("You haven't booked your seat.");
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // const getPaymentStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "paid":
  //       return "bg-green-500";
  //     case "pending":
  //       return "bg-yellow-500";
  //     case "failed":
  //       return "bg-red-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };
  if (user === null || !user?.id) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your tickets
          </h1>

          <Auth
            navigateRoute=""
            callback={[
              () => {
                window.location.reload();
              },
            ]}
            state={() => {}}
          >
            <Button>Sign In</Button>
          </Auth>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-black">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Tickets Found</h1>
          <p className="text-muted-foreground">
            You haven&apos;t booked any tickets yet
          </p>
          <Button onClick={() => router.push("/")}>Book a Ticket</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <Card key={ticket._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  {ticket?.destination?.destinationAddress ||
                    "Unknown Destination"}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(ticket?.status)}>
                    {ticket.status}
                  </Badge>
                  {/* <Badge
                    className={getPaymentStatusColor(ticket?.paymentStatus)}
                  >
                    {ticket?.paymentStatus}
                  </Badge> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Address:</span>
                  <span className="font-medium">{ticket.pickupAddress}</span>
                </div>

                {/* {ticket?.destination?.Trips?.length > 0 ? (
                  ticket.destination.Trips.map((trip, index) => (
                    <div
                      key={trip._id || index}
                      className="border rounded p-2 bg-muted/30"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date: </span>
                        <span className="font-medium">
                          {new Date(trip.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Timing:</span>
                        <span className="font-medium">
                          {trip.Timing.join(", ")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No trips found for this destination.
                  </p>
                )} */}

                {/* <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-medium">
                    {ticket.passengerDetails?.length || 1}
                  </span>
                </div> */}

                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/booking-confirmation?bookingId=${ticket._id}`
                      )
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
                <div className="pt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
