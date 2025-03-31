import axios from "axios";
import { IBooking } from "@/src/model/booking.model";

const URL = process.env.VERCEL_URL || "http://localhost:3000";

export const bookingApi = {
  // Create new booking
  createBooking: async (bookingData: Omit<IBooking, "_id">): Promise<IBooking> => {
    try {
      const response = await axios.post<{ data: IBooking }>(`${URL}/api/passanger/booking`, bookingData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<IBooking> => {
    try {
      const response = await axios.get<{ data: IBooking }>(`${URL}/api/passanger/booking?bookingId=${bookingId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (bookingId: string, bookingData: Partial<IBooking>): Promise<IBooking> => {
    try {
      const response = await axios.put<{ data: IBooking }>(`${URL}/api/passanger/booking`, {
        bookingId,
        ...bookingData
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (bookingId: string): Promise<void> => {
    try {
      await axios.delete(`${URL}/api/passanger/booking`, {
        data: { bookingId }
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }
}; 