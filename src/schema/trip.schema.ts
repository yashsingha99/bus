import { z } from "zod";
import { Timing } from "../model/trip.model";

//------------------------------------------------------------------------------------------------//
// Trip Model Validation

export const tripSchema = z.object({
  price: z.number(),
  destinationAddress: z.string(),
  Status: z.boolean().default(false),
  DateTiming: z.array(
    z.object({
      Timing: z.enum([Timing.Forenoon, Timing.Afternoon, Timing.Both]),
      date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    })
  ),
});
