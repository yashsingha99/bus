import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  destinationAddress: string; 
  pickupAddress: string;     
  bookedBy: mongoose.Types.ObjectId; 
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    destinationAddress: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel", 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const BookingModel = mongoose.model<IBooking>("BookingModel", bookingSchema);
