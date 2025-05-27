import axios from "axios";
import { ITrip } from "../model/trip.model";

export const tripApi = {
  // Get all trips
  getAllTrips: async (): Promise<ITrip[]> => {
    try {
      const response = await axios.get<{ data: ITrip[] }>(`/api/admin/trip`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  getTripById: async (tripId: string): Promise<ITrip> => {
    try {
      const response = await axios.get<{ data: ITrip }>(`/api/admin/trip/${tripId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trip:", error);
      throw error;
    }
  },

  // Create new trip
  createTrip: async (tripData: ITrip): Promise<ITrip> => {
    try {
      const response = await axios.post<{ data: ITrip }>(`/api/admin/trip`, tripData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  },

  // Update trip
  updateTrip: async (tripData: ITrip): Promise<ITrip> => {
    try {
      const response = await axios.put<{ data: ITrip }>(`/api/admin/trip/`, tripData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  },

  // Delete trip
  deleteTrip: async (tripId: string): Promise<void> => {
    try {
      await axios.delete(`/api/admin/trip/${tripId}`);
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  },

  //Get Trip Names

  getTripNames: async(): Promise<void> => {
      try {
         const response = await axios.get(`/api/trip`);
         return response.data.data;
      } catch (error) {
         console.error("Error deleting trip:", error);
         throw error;
      }
  }
}; 