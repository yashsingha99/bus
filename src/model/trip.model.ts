import mongoose, { Schema, Document } from "mongoose";

enum Status {
  Active = "Active",
  Upcoming = "Upcoming",
  Expiry = "Expiry",
}

export interface SingleTrip {
  price: number;
  Timing: [string];
  date: Date;
  Status: Status;
  busImage: String;
  SeatsLimit: Number;
}

export interface ITrip extends Document {
  // owner: mongoose.Schema.Types.ObjectId;
  destinationAddress: string;
  Trips: SingleTrip[];
}

const tripSchema: Schema<ITrip> = new Schema(
  {
    // owner: { type: mongoose.Schema.Types.ObjectId, require: true },
    destinationAddress: { type: String, required: true },
    Trips: [
      {
        price: { type: Number, required: true },
        Timing: [{ type: String, required: true }],
        date: { type: Date, required: true },
        Status: { type: String, enum: Object.values(Status), required: true },
        SeatsLimit: { type: Number, required: true },
        busImage: {
          type: String,
          default:
            "https://images.pexels.com/photos/29702987/pexels-photo-29702987/free-photo-of-luxury-tour-bus-parked-on-street-in-daylight.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      },
    ],
  },
  { timestamps: true }
);

export const TripModel = mongoose.model<ITrip>("TripModel", tripSchema);
