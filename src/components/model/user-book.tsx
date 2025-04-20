"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast, Toaster } from "sonner";
// import { useRouter } from "next/navigation";
import { pickupLocations } from "../search-card";
import { tripApi } from "@/API/trip.api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface BookingModel {
  pickupAddress: string;
  bookedBy: string;
  destination: string;
  time: string;
  date: string;
  totalAmount: number;
  paymentId: string;
}

interface TripData {
  _id: string;
  destinationAddress: string;
}

type PropsData = {
  children: React.ReactNode;
};

function UserBook({ children }: PropsData) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  //   const router = useRouter();

  const [destinationData, setDestinationData] = useState<TripData[] | null>(
    null
  );

  const [error, setError] = useState({
    pickupAddress: "",
    bookedBy: "",
    destination: "",
    time: "",
    date: "",
    totalAmount: "",
    paymentId: "",
  });

  const [bookingModel, setBookingModel] = useState<BookingModel>({
    pickupAddress: "",
    bookedBy: "",
    destination: "",
    time: "",
    date: "",
    totalAmount: 0,
    paymentId: "",
  });

  const fetchTripsName = async () => {
    try {
      const res = await tripApi.getTripNames();
      if (Array.isArray(res)) {
        setDestinationData(res);
      } else {
        toast.error("Failed to load destinations");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Something went Wrong!");
      } else {
        console.error("Unknown error", error);
      }
      toast.error("Failed to load destinations");
    }
  };

  useEffect(() => {
    fetchTripsName();
  }, []);

  const validateForm = () => {
    let hasErrors = false;
    const newError = {
      pickupAddress: "",
      bookedBy: "",
      destination: "",
      time: "",
      date: "",
      totalAmount: "",
      paymentId: "",
    };

    if (!bookingModel.bookedBy) {
      newError.bookedBy = "User ID is required";
      hasErrors = true;
    }
    if (!bookingModel.date) {
      newError.date = "Exam Date is required";
      hasErrors = true;
    }
    if (!bookingModel.destination) {
      newError.destination = "Destination is required";
      hasErrors = true;
    }
    if (!bookingModel.paymentId) {
      newError.paymentId = "Payment ID is required";
      hasErrors = true;
    }
    if (!bookingModel.pickupAddress) {
      newError.pickupAddress = "Pickup address is required";
      hasErrors = true;
    }
    if (!bookingModel.totalAmount) {
      newError.totalAmount = "Total amount is required";
      hasErrors = true;
    }

    setError(newError);
    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const endpoint = "/api/admin/bookings";

      const payload = { ...bookingModel };

      const response = await axios.post(endpoint, payload);

      if (response.data) {
        toast.success("Created successfully!");
        setIsOpen(false);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error("Error creating booking");
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof BookingModel, value: string) => {
    setBookingModel((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeAmount = (field: keyof BookingModel, value: string) => {
    const num = parseFloat(value);
    setBookingModel((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  return (
    <>
      <Toaster />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book User</DialogTitle>
            <DialogDescription>Create a new Booking</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                name="userId"
                placeholder="User ID"
                value={bookingModel.bookedBy}
                onChange={(e) => handleChange("bookedBy", e.target.value)}
              />
              {error.bookedBy && (
                <p className="text-red-500 text-sm">{error.bookedBy}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentId">Payment ID</Label>
              <Input
                id="paymentId"
                name="paymentId"
                type="text"
                placeholder="Payment ID"
                value={bookingModel.paymentId}
                onChange={(e) => handleChange("paymentId", e.target.value)}
              />
              {error.paymentId && (
                <p className="text-red-500 text-sm">{error.paymentId}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                placeholder="Amount"
                value={bookingModel.totalAmount}
                onChange={(e) =>
                  handleChangeAmount("totalAmount", e.target.value)
                }
              />
              {error.totalAmount && (
                <p className="text-red-500 text-sm">{error.totalAmount}</p>
              )}
            </div>

            <Select
              defaultValue={bookingModel.pickupAddress}
              onValueChange={(value) => handleChange("pickupAddress", value)}
              aria-label="Pick-up location"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick-up location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mathura</SelectLabel>
                  {pickupLocations?.map((pickUp) => (
                    <SelectItem key={pickUp} value={pickUp}>
                      {pickUp}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error.pickupAddress && (
              <p className="text-red-500 text-sm">{error.pickupAddress}</p>
            )}

            <Select
              defaultValue={bookingModel.destination}
              onValueChange={(value) => handleChange("destination", value)}
              aria-label="Destination"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your center" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Nptel Center</SelectLabel>
                  {destinationData?.map((dest) => (
                    <SelectItem key={dest._id} value={dest._id}>
                      {dest.destinationAddress}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error.destination && (
              <p className="text-red-500 text-sm">{error.destination}</p>
            )}

            <Select
              defaultValue={bookingModel.time}
              onValueChange={(value) => handleChange("time", value)}
              aria-label="Time"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your Exam Timing" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Timing</SelectLabel>
                  {["forenoon", "afternoon"]?.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error.time && <p className="text-red-500 text-sm">{error.time}</p>}
            <Select
              defaultValue={bookingModel.date}
              onValueChange={(value) => handleChange("date", value)}
              aria-label="Date"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your Exam Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Exam Date</SelectLabel>
                  {[
                    "Sun, 27 Apr, 2025",
                    "Sat, 3 May, 2025",
                    "Sun, 4 May, 2025",
                  ]?.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
          </div>

          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Create Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserBook;
