import {create} from 'zustand';

interface Trip {
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface States {
  tripData: Trip[]
}

interface Actions {
  addTripData: (newTrip : Trip[]) => void;
//   updateTripData: (index : number, newTrip : Trip[]) => void;
//   deleteTripData: (index : number, newTrip : string[]) => void;
//   decrease: () => void;
//   decrease: () => void;
}


export const useTripData =  create<States & Actions>((set) => ({
  tripData: [],

  addTripData: (newTrip) => set((state) => ({tripData: [...state.tripData, ...newTrip]})),
//   updateTripData: (index, newTrip) => set((state) => ({}))

}));

 