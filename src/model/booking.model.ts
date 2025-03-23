import mongoose, { Schema, Document } from "mongoose";
// import {DateTiming} from "./trip.model"
//---------------------------------------- Booking Model TYpe Define --------------------------------------------------------//

export interface IBooking extends Document {
  pickupAddress: string;     
  bookedBy: mongoose.Types.ObjectId; 
  trip:  Schema.Types.ObjectId;
  // DateTIme: DateTiming
}

//---------------------------------------- Booking Model --------------------------------------------------------//

const bookingSchema: Schema<IBooking> = new Schema(
  {
    pickupAddress: {
      type: String,
      required: true,
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel", 
      required: true,
    },
    trip: {
      type: Schema.Types.ObjectId,
      ref: "TripModel ",
      required: true
    },
    // DateTIme: {
    //   type: DateTiming,
    //   required: true,
    // }
  },
  {
    timestamps: true, 
  }
);

export const BookingModel = mongoose.model<IBooking>("BookingModel", bookingSchema);
