import { z } from "zod";

//------------------------------------------------------------------------------------------------//
// Notification Model Validation

export const notificationsSchema = z.object({
  title: z.string().nonempty("Title is required"), 
  content: z.string().nonempty("Content is required"),
  notifyTo: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"), 
});
