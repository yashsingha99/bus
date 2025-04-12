import mongoose, { Schema, Document } from "mongoose";
// import {DateTiming} from "./trip.model"
//---------------------------------------- Booking Model Type Define --------------------------------------------------------//

export interface IBooking extends Document {
  pickupAddress: string;     
  bookedBy: mongoose.Types.ObjectId; 
  destination: mongoose.Types.ObjectId;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  paymentProof: string;
  paymentId: string;
  // DateTIme: DateTiming
}


//---------------------------------------- Booking Model --------------------------------------------------------//


const bookingSchema: Schema<IBooking> = new Schema(
  {
    pickupAddress: {
      type: String,
      required: [true, "Pickup address is required"],
      trim: true
    },
    time: {
      type: String,
      required: [true, "Time is required"]
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel", 
      required: [true, "User reference is required"]
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "TripModel",
      required: [true, "Destination reference is required"]
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"]
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    paymentProof: {
      type: String,
    },
    paymentId: {
      type: String,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
bookingSchema.index({ bookedBy: 1 });
bookingSchema.index({ destination: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: 1 });

export const BookingModel = mongoose.models.BookingModel || mongoose.model<IBooking>("BookingModel", bookingSchema);
