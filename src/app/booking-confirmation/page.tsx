"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Clock4, MapPin, User } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Booking ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/passanger/booking?bookingId=${bookingId}`
        );
        setBooking(response.data.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Booking not found</h3>
              <p className="text-muted-foreground">
                {error || "The booking you're looking for doesn't exist"}
              </p>
              <Link href="/search">
                <Button className="mt-4">Back to Search</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Link href="/search">
          <Button variant="ghost" size="sm">
            Back to Search
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        {booking.paymentStatus === "pending" ? (
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock4 className="h-6 w-6 text-yellow-500" />
              <CardTitle className="text-2xl">Pending Booking!</CardTitle>
            </div>
            <CardDescription>
              Your ticket will be confirmed after the verification of the payment.
            </CardDescription>
          </CardHeader>
        ) : (
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            </div>
            <CardDescription>
              Your booking has been successfully confirmed
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.pickupAddress} to{" "}
                  {booking.destination?.destinationAddress || "Destination"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Time: {booking.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{booking.passengerDetails.length} Passenger(s)</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Booking Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium capitalize">
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-medium capitalize">
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/searchBus")}>
            Book Another Trip
          </Button>
          <Button
            onClick={() =>
              router.push(`/my-bookings?userId=${booking.bookedBy}`)
            }
          >
            View My Bookings
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passenger Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {booking.passengerDetails.map((passenger: any, index: number) => (
              <div key={index} className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Passenger {index + 1}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{passenger.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{passenger.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gender:</span>
                    <span className="font-medium capitalize">
                      {passenger.gender}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
