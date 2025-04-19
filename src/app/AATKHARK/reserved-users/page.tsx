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
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role?: string;
}

interface Destination {
  destinationAddress: string;
  _id: string;
}

export interface PopulatedBooking {
  _id: string;
  pickupAddress: string;
  dropoffAddress: string;
  destination: Destination;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  bookedBy: User;
  paymentProof: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ReservedUsersPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;
      if (userData?.role !== "NATRAJ121290") {
        router.push("/");
      }
    }
  }, [router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (paymentStatus !== "all") {
        params.append("status", paymentStatus);
      }

      const response = await axios.get(`/api/admin/bookings?${params}`);
      setBookings(response.data.data);
      setPagination(response.data.pagination);
    } catch (err : unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, search, fetchBookings, pagination.limit, paymentStatus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  const handleStatusChange = (value: string) => {
    setPaymentStatus(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  return (
    <>
      <div className="py-10">
        {loading ? (
          <ReservedUsersSkeleton />
        ) : (
          <>
            <div className="flex flex-1 items-center space-x-2 mb-6">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={handleSearch}
                className="max-w-sm"
              />
              <Select value={paymentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
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
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>{booking.bookedBy.fullName}</TableCell>
                        <TableCell>{booking.bookedBy?.phone}</TableCell>
                        <TableCell>
                          {new Date(booking.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.paymentStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <UserDetailsDrawer
                            booking={booking}
                            isLoading={loading}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between p-4">
                <p className="text-sm text-muted-foreground">
                  Showing {bookings.length} of {pagination.total} bookings
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </>
  );
}
