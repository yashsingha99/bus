"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
} from "lucide-react";
import axios from "axios";
import { Suspense } from "react";
import { useQRCode } from "next-qrcode";

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

interface Booking {
  _id: string;
  bookingId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  passengerCount: number;
  selectedDate: string;
  selectedTime: string;
  time: string;
  date: string;
  pickupAddress: string;
  destination: {
    _id: string;
    name: string;
    destinationAddress: string;
  };
  bookedBy: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  seatNumber?: string;
  busNumber?: string;
  passengerName?: string;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { Canvas } = useQRCode();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Booking ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<{ data: Booking }>(
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
              <Link href="/searchBus">
                <Button className="mt-4">
                  <ArrowLeft className="ml-2 h-4 w-4" /> Back to Search
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center">
          <Link href="/searchBus">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="ml-2 h-4 w-4" /> Back to Search
            </Button>
          </Link>
        </div>

        <div className="relative mx-auto max-w-md bg-white border border-gray-300 shadow-lg rounded-3xl p-6 overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
            <p className="text-6xl text-blue-200 opacity-10 font-cursive select-none">
              Bustify
            </p>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Bustify</h1>
                <p className="text-xs text-gray-500">Authorized Bus Ticket</p>
              </div>
              <img
                src="/bustify-logo.png"
                alt="Bustify Logo"
                className="h-10"
              />
            </div>

            {/* Route */}
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                Travel Itinerary
              </div>
              <div className="flex justify-center items-center gap-2 mt-2 text-gray-800">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{booking.pickupAddress}</span>
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{booking.destination.destinationAddress}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Date: <span className="font-medium">{booking.date}</span> | Time:{" "}
                <span className="font-medium">{booking.time}</span>
              </p>
            </div>

            {/* Details */}
            <div className="text-sm grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{booking.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-medium capitalize">{booking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">₹{booking.totalAmount}</span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Seat No</p>
                  <p className="text-xl font-bold text-blue-700">
                    {booking.seatNumber || "TBD"}
                  </p>
                </div>
                <div>
                  <Canvas
                    text={`${window.location.origin}/ticket?bookingId=${booking._id}`}
                    options={{
                      errorCorrectionLevel: "M",
                      width: 80,
                      margin: 1,
                      color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-500 border-t pt-4 flex justify-between items-end">
              <div>
                <p className="italic">Please present this ticket during boarding.</p>
                <p>This is a digitally generated copy.</p>
              </div>
              <div className="text-right">
                <img
                  src="/bustify-signature.png"
                  alt="Bustify Signature"
                  className="h-6"
                />
                <p className="text-[10px]">Authorized Signatory</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/searchBus")}>
                Book Another Trip
              </Button>
              <Button onClick={() => router.push("/tickets")}>
                View My Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
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
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  );
}
