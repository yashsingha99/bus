import mongoose, { Schema, Document } from "mongoose";

export enum Timing {
  Forenoon = "Forenoon",
  Afternoon = "Afternoon",
  Both = "Both",
}

export interface DateTiming {
  Timing: Timing;
  date: Date;
}

export interface ITrip extends Document {
  price: number;
  destinationAddress: string;
  DateTiming: DateTiming[];
  Status: Boolean;
}

const dateTimingSchema = new Schema<DateTiming>({
  Timing: { type: String, enum: Object.values(Timing), required: true },
  date: { type: Date, required: true },
});

const tripSchema: Schema<ITrip> = new Schema(
  {
    price: { type: Number, required: true },
    destinationAddress: { type: String, required: true },
    DateTiming: [dateTimingSchema],
    Status: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const TripModel = mongoose.model<ITrip>("TripModel", tripSchema);
