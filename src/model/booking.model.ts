import mongoose, { Schema, Document } from "mongoose";
// import {DateTiming} from "./trip.model"
//---------------------------------------- Booking Model Type Define --------------------------------------------------------//
interface PassengerDetails {
  name: string;
  phone: string;
  gender: "male" | "female" | "other";
}

export interface IBooking extends Document {
  pickupAddress: string;     
  bookedBy: mongoose.Types.ObjectId; 
  trip: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
  time: string;
  passengerDetails: PassengerDetails[];
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  
  // DateTIme: DateTiming
}


//---------------------------------------- Booking Model --------------------------------------------------------//

const passengerSchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Passenger name is required"],
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"],
    trim: true
  },
  gender: { 
    type: String, 
    required: [true, "Gender is required"],
    enum: ["male", "female", "other"]
  }
}, { _id: false });

const bookingSchema: Schema<IBooking> = new Schema(
  {
    pickupAddress: {
      type: String,
      required: [true, "Pickup address is required"],
      trim: true
    },
    passengerDetails: {
      type: [passengerSchema],
      required: [true, "At least one passenger is required"],
      validate: {
        validator: function(v: PassengerDetails[]) {
          return v.length > 0;
        },
        message: "At least one passenger is required"
      }
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
    trip: {
      type: Schema.Types.ObjectId,
      ref: "TripModel",
      required: [true, "Trip reference is required"]
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
bookingSchema.index({ trip: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: 1 });

export const BookingModel = mongoose.models.BookingModel || mongoose.model<IBooking>("BookingModel", bookingSchema);
