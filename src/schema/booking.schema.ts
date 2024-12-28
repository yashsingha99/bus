import { z } from "zod";

//------------------------------------------------------------------------------------------------//
// Booking Model Validation

export const bookingSchema = z.object({
  destinationAddress: z.string().nonempty("Destination address is required"), 
  pickupAddress: z.string().nonempty("Pickup address is required"),  
  bookedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
});
