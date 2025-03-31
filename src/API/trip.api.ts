import axios from "axios";
import { ITrip } from "../model/trip.model";

const URL = process.env.VERCEL_URL || "http://localhost:3000";

export const tripApi = {
  // Get all trips
  getAllTrips: async (): Promise<ITrip[]> => {
    try {
      const response = await axios.get<{ data: ITrip[] }>(`${URL}/api/admin/trip`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  // Get single trip by ID
  getTripById: async (tripId: string): Promise<ITrip> => {
    try {
      const response = await axios.get<{ data: ITrip }>(`${URL}/api/admin/trip/${tripId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trip:", error);
      throw error;
    }
  },

  // Create new trip
  createTrip: async (tripData: Omit<ITrip, "_id">): Promise<ITrip> => {
    try {
      const response = await axios.post<{ data: ITrip }>(`${URL}/api/admin/trip`, tripData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  },

  // Update trip
  updateTrip: async (tripId: string, tripData: Partial<ITrip>): Promise<ITrip> => {
    try {
      const response = await axios.put<{ data: ITrip }>(`${URL}/api/admin/trip/${tripId}`, tripData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  },

  // Delete trip
  deleteTrip: async (tripId: string): Promise<void> => {
    try {
      await axios.delete(`${URL}/api/admin/trip/${tripId}`);
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  }
}; 