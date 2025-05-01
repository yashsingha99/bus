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
import { useRouter } from "next/navigation";
import { Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserBook from "@/components/model/user-book";
import { Checkbox } from "@/components/ui/checkbox";
import * as XLSX from "xlsx";

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

// interface PaginationData {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

export default function ReservedUsersPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<PopulatedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    [key: string]: string[];
  }>({});
  // const [pagination, setPagination] = useState<PaginationData>({
  //   total: 0,
  //   page: 1,
  //   limit: 10,
  //   totalPages: 0,
  // });

  useEffect(() => {
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
      const response = await axios.get(`/api/admin/bookings`);
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
      // setPagination(response.data.bookings);
    } catch (err : unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message || "Failed to fetch bookings");
      } else {
        toast.error("Failed to fetch bookings");
      }
      // console.error(err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((b) => {
          const val =
            key === "fullName"
              ? b.bookedBy.fullName
              : key === "phone"
              ? b.bookedBy.phone
              : key === "paymentStatus"
              ? b.paymentStatus
              : key === "destination"
              ? b.destination.destinationAddress
              : key === "date"
              ? b.date
              : key === "time"
              ? b.time
              : key === "pickupAddress"
              ? b.pickupAddress
              : "";
          return values.includes(val);
        });
      }
    });
    setFilteredBookings(filtered);
  }, [filters, bookings]);

  const getUniqueValues = (key: string): string[] => {
    return Array.from(
      new Set(
        bookings.map((b) => {
          if (key === "fullName") return b.bookedBy.fullName;
          if (key === "phone") return b.bookedBy.phone;
          if (key === "paymentStatus") return b.paymentStatus;
          if (key === "destination") return b.destination.destinationAddress;
          if (key === "date") return b.date;
          if (key === "time") return b.time;
          if (key === "pickupAddress") return b.pickupAddress;
          return "";
        })
      )
    );
  };

  const toggleFilterValue = (key: string, value: string) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleDownload = () => {
    const dataToExport = filteredBookings.map((booking) => ({
      Name: booking.bookedBy.fullName,
      Phone: booking.bookedBy.phone,
      Date: booking.date,
      Destination: booking.destination.destinationAddress,
      Time: booking.time,
      PickupPoint: booking.pickupAddress,
      PaymentStatus: booking.paymentStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Bookings");
    XLSX.writeFile(workbook, "filtered_bookings.xlsx");
  };

  const renderFilter = (key: string, label: string) => (
    <TableHead key={key} className="relative">
      <div className="flex items-center gap-2">
        {label}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Filter className={`w-4 h-4 ${filters[key]?.length > 0 && "text-red-600"}`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 space-y-1 max-h-64 overflow-auto">
            {getUniqueValues(key).map((val) => (
              <div key={val} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters[key]?.includes(val) || false}
                  onCheckedChange={() => toggleFilterValue(key, val)}
                />
                <span className="text-sm">{val}</span>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, [key]: [] }))}
              className="w-full justify-start text-red-500"
            >
              Clear Filter
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  );

  return (
    <div className="py-10">
      <div className="flex flex-1 items-center space-x-2 mb-6">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <UserBook>
          <Button>Book User</Button>
        </UserBook>
        <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Excel
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              {renderFilter("fullName", "Name")}
              {renderFilter("phone", "CONTACT NO.")}
              {renderFilter("date", "EXAM DATE")}
              {renderFilter("destination", "Exam Center")}
              {renderFilter("time", "Exam Time")}
              {renderFilter("pickupAddress", "Pickup Point")}
              {renderFilter("paymentStatus", "Payment Status")}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings
              .filter((b) =>
                search
                  ? b.bookedBy.fullName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    b.bookedBy.phone.includes(search)
                  : true
              )
              .map((booking, i) => (
                <TableRow key={booking._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{booking.bookedBy.fullName}</TableCell>
                  <TableCell>{booking.bookedBy.phone}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.destination.destinationAddress}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.pickupAddress}</TableCell>
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
                    <UserDetailsDrawer booking={booking} isLoading={loading} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  );
}
