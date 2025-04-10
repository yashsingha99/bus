"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDetailsDrawer from "./_components/userDetailsDrawer";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface PopulatedBooking {
  _id: string;
  pickupAddress: string;
  dropoffAddress: string;
  date: string;
  time: string;
  destination: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  bookedBy: User;
  paymentProof: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
  passengerDetails: {
    name: string;
    phone: string;
    gender: "male" | "female" | "other";
  }[];
}

const URL = process.env.NEXT_PUBLIC_API_URL;

function ReservedUsersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-9 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ReservedUsersPage() {
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<PopulatedBooking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/bookings`);
      console.log(response.data.data );
      
      setBookings(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }; 
  useEffect(() => {
    fetchBookings();
  }, []);

  // const filteredBookings = bookings?.filter((booking) =>
  //   booking.bookedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   booking.bookedBy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   booking.bookedBy.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   booking.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   booking.time.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleUpdateBooking = async (updatedBooking: PopulatedBooking) => {
    try {
      await axios.put(`${URL}/api/admin/bookings/${updatedBooking._id}`, updatedBooking);
      await fetchBookings();
      setIsDrawerOpen(false);
      toast.success("Booking updated successfully");
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await axios.delete(`${URL}/api/admin/bookings/${bookingId}`);
      await fetchBookings();
      setIsDrawerOpen(false);
      toast.success("Booking deleted successfully");
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <>
      <div className=" py-10">
        {loading ? (
          <ReservedUsersSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <PlaceholdersAndVanishInput
                placeholders={["Search by name, email, or phone..."]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onSubmit={() => fetchBookings()}
                styleInput="w-[90%]"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.bookedBy.fullName}</TableCell>
                      {/* <TableCell>{booking.bookedBy?.phoneNumber}</TableCell> */}
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                             
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <UserDetailsDrawer booking={booking} isLoading={loading} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </>
  );
}
