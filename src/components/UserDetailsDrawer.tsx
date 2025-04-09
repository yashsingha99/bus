import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface User {
  _id: string
  fullName: string
  email: string
  phone: string
}

interface PopulatedBooking {
  _id: string
  pickupAddress: string
  dropoffAddress: string
  date: string
  time: string
  trip: string
  destination: string
  status: string
  paymentStatus: string
  totalAmount: number
  bookedBy: User
  createdAt: string
  updatedAt: string
}

interface UserDetailsDrawerProps {
  booking: PopulatedBooking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (booking: PopulatedBooking) => void
  onDelete?: (bookingId: string) => void
}

export function UserDetailsDrawer({
  booking,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: UserDetailsDrawerProps) {
  if (!booking) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription>
            View and manage booking information
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium">Customer Information</h3>
            <p>Name: {booking.bookedBy.fullName}</p>
            <p>Email: {booking.bookedBy.email}</p>
            <p>Phone: {booking.bookedBy.phone}</p>
          </div>
          <div>
            <h3 className="font-medium">Booking Information</h3>
            <p>Pickup: {booking.pickupAddress}</p>
            <p>Dropoff: {booking.dropoffAddress}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Time: {booking.time}</p>
            <p>Trip Type: {booking.trip}</p>
            <p>Destination: {booking.destination}</p>
            <p>Status: {booking.status}</p>
            <p>Payment Status: {booking.paymentStatus}</p>
            <p>Total Amount: ${booking.totalAmount}</p>
          </div>
          <div className="flex space-x-2">
            {onUpdate && (
              <Button onClick={() => onUpdate(booking)}>
                Update Booking
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => onDelete(booking._id)}
              >
                Delete Booking
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 