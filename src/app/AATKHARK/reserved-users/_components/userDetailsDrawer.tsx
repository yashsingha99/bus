"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, CreditCard, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { PopulatedBooking } from "../page";
import { UserDetailsDrawerSkeleton } from "./user-details-drawer-skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface UserDetailsDrawerProps {
  booking: PopulatedBooking;
  isLoading?: boolean;
}

export default function UserDetailsDrawer({
  booking,
  isLoading = false,
}: UserDetailsDrawerProps) {
  const [status, setStatus] = useState(booking.status);
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [pickupAddress, setPickupAddress] = useState(booking.pickupAddress || "");
  const [destinationAddress, setDestinationAddress] = useState(
    booking.destination?.destinationAddress || ""
  );
  const [time, setTime] = useState(booking.time || "");
  const [amount, setAmount] = useState(booking.totalAmount || 0);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/bookings/${booking._id}`);
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/admin/bookings/${booking._id}`, {
        status,
        paymentStatus,
        pickupAddress,
        destinationAddress,
        time,
        totalAmount: amount,
      });
      toast.success("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    } finally {
      setIsUpdating(false);
    }
  };

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <FeedbackButton className="w-full" variant="default">
            View Details
          </FeedbackButton>
        </DrawerTrigger>

        <DrawerContent>
          <div className="mx-auto w-full max-w-lg p-4 max-h-[80vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold">Booking Details</DrawerTitle>
              <DrawerDescription>
                Review and manage booking information
              </DrawerDescription>
            </DrawerHeader>

            {isLoading ? (
              <UserDetailsDrawerSkeleton />
            ) : (
              <div className="space-y-6 py-4">
                {isUpdating ? (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div>
                          <label className="text-sm font-medium">Pickup Address</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Destination Address</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={destinationAddress}
                            onChange={(e) => setDestinationAddress(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Time</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Amount (₹)</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium">Booking Status</h3>
                            <Badge className={getStatusColor(status)}>
                              {status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium">Payment Status</h3>
                            <Badge className={getPaymentStatusColor(paymentStatus)}>
                              {paymentStatus.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 space-y-4 ">
                        <h3 className="font-semibold">Trip Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              Pickup: {pickupAddress || "Release Soon"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              Center: {destinationAddress || "Release Soon"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Time: {time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Amount: ₹{amount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {booking.paymentProof && (
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          <h3 className="font-semibold">Payment Proof</h3>
                          <div
                            className="relative w-full h-48 cursor-pointer"
                            onClick={() => setIsImageFullScreen(true)}
                          >
                            <Image
                              src={booking.paymentProof}
                              alt="Payment Proof"
                              fill
                              className="object-contain rounded-lg"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {booking?.paymentId && (
                      <Card>
                        <CardContent className="p-4 gap-4 flex items-center justify-between ">
                          <h3 className="font-semibold">Payment ID:</h3>
                          <p>{booking.paymentId}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Status Update Controls */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Payment Status</label>
                      <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {!isUpdating ? (
                    <FeedbackButton
                      className="w-full"
                      variant="default"
                      onClick={() => setIsUpdating(true)}
                      disabled={isUpdating}
                    >
                      Update Booking
                    </FeedbackButton>
                  ) : (
                    <FeedbackButton
                      className="w-full"
                      variant="default"
                      onClick={handleUpdate}
                      disabled={!isUpdating}
                    >
                      Submit
                    </FeedbackButton>
                  )}

                  {isUpdating && (
                    <FeedbackButton
                      className="w-full"
                      variant="default"
                      onClick={() => setIsUpdating(false)}
                    >
                      Cancel Update
                    </FeedbackButton>
                  )}

                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Booking"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Full Screen Image Modal */}
      {isImageFullScreen && booking.paymentProof && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setIsImageFullScreen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={booking.paymentProof}
                alt="Payment Proof"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
