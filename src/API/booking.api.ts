import axios from "axios";
import { IBooking } from "@/model/booking.model";


export const bookingApi = {
  // Create new booking
  createBooking: async (bookingData: Omit<IBooking, "_id" | "createdAt" | "updatedAt">): Promise<IBooking> => {
    try {
      const response = await axios.post<{ data: IBooking }>(`/api/passanger/booking`, bookingData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<IBooking> => {
    try {
      const response = await axios.get<{ data: IBooking }>(`/api/passanger/booking?bookingId=${bookingId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },

  // Get bookings by user ID
  getBookingsByUser: async (userId: string): Promise<IBooking[]> => {
    try {
      const response = await axios.get<{ data: IBooking[] }>(`/api/passanger/bookings?userId=${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (bookingId: string, bookingData: Partial<IBooking>): Promise<IBooking> => {
    try {
      const response = await axios.put<{ data: IBooking }>(`/api/passanger/booking`, {
        bookingId,
        ...bookingData
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: "pending" | "confirmed" | "cancelled"): Promise<IBooking> => {
    try {
      const response = await axios.put<{ data: IBooking }>(`/api/passanger/booking/status`, {
        bookingId,
        status
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (bookingId: string, paymentStatus: "pending" | "completed" | "failed"): Promise<IBooking> => {
    try {
      const response = await axios.put<{ data: IBooking }>(`/api/passanger/booking/payment`, {
        bookingId,
        paymentStatus
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<IBooking> => {
    try {
      const response = await axios.put<{ data: IBooking }>(`/api/passanger/booking/cancel`, {
        bookingId
      });
      return response.data.data;
    } catch (error) {
      console.error("Error canceling booking:", error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (bookingId: string): Promise<void> => {
    try {
      await axios.delete(`/api/passanger/booking`, {
        data: { bookingId }
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }
}; 