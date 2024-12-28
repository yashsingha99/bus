import mongoose, { Schema, Document } from "mongoose";

enum Timing {
  Forenoon = "Forenoon",
  Afternoon = "Afternoon",
  Both = "Both",
}

enum Status{
    Active = "Active",
   UnActive = "UnActive",
}

interface DateTiming {
  Timing: Timing;
  date: Date;
}

export interface ITrip extends Document {
  price: number;
  destinationAddress: string;
  DateTiming: DateTiming[];
  Status: Status;
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
    Status: { type: String, enum: Object.values(Status), required: true },
  },
  { timestamps: true }
);

export const TripModel = mongoose.model<ITrip>("TripModel", tripSchema);
