import mongoose, { Schema, Document } from "mongoose";

enum Status {
  Active = "Active",
  Upcoming = "Upcoming",
  Expiry = "Expiry",
}

export interface SingleTrip {
  _id: string
  price: number;
  Timing: [string];
  date: Date;
  Status: Status;
  SeatsLimit: number;
}

export interface ITrip extends Document {
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
      },
    ],
  },
  { timestamps: true }
);

export const TripModel = (mongoose.models.TripModel || mongoose.model<ITrip>("TripModel", tripSchema)) as mongoose.Model<ITrip>;
