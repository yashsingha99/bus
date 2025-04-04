"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import { ITrip } from "@/model/trip.model";
import { cn } from "@/lib/utils";
import { IconBrandOnlyfans } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@heroui/button";
// import { Alert } from "@heroui/alert";
import Alert from "@mui/material/Alert";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import useScreenSize from "@/hooks/use-screen-size";
const URL = process.env.VERCEL_URL || "http://localhost:3000";
 
export default function EditTripPage() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [alertIsVisible, setAlertIsVisible] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [chevron, setChevron] = useState(-1);
  const isMobile = useScreenSize();

  const [formData, setFormData] = useState<any>({
    destinationAddress: "",
    Trips: [
      {
        price: 0,
        Timing: [""],
        date: new Date(),
        Status: "Active",
        SeatsLimit: 0,
        busImage: "",
      },
    ],
  });

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      if (tripId === "newTrip") {
        setFormData({
          destinationAddress: "",
          Trips: {
            price: 0,
            Timing: [""],
            date: new Date(),
            Status: "Active",
            SeatsLimit: 0,
            busImage: "",
          },
        });
      }
      try {
        const data = await tripApi.getTripById(tripId);
        setTrip(data);
        setFormData({
          destinationAddress: data.destinationAddress,
          Trips: data.Trips,
        });
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleAddNewTrip = () => {
    const emptyTrip = {
      price: 0,
      Timing: [""],
      date: new Date(),
      Status: "Active",
      SeatsLimit: 0,
      busImage: "",
    };
    const newTrips = [...formData.Trips, emptyTrip];
    setFormData({
      destinationAddress: formData.destinationAddress,
      Trips: newTrips,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("Trips.")) {
      const [_, index, field] = name.split(".");
      setFormData((prev: typeof formData) => ({
        ...prev,
        Trips: prev.Trips.map((trip: (typeof formData.Trips)[0], i: number) => {
          if (i === parseInt(index)) {
            return { ...trip, [field]: value };
          }
          return trip;
        }),
      }));
    } else {
      setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    }
  };

  const deleteTripByIndex = (index: Number) => {
    const filteredTrips = formData.Trips.filter(
      (trip: any, idx: Number) => idx !== index
    );
    setFormData({
      destinationAddress: formData.destinationAddress,
      Trips: filteredTrips,
    });
  };

  // useEffect(() => {
  //   if (alertIsVisible) {
  //     setTimeout(() => {
  //       setAlertIsVisible(false);
  //     }, 5000);
  //   }
  // }, [alertIsVisible]);
  console.log(chevron);

  const handleChangeChevron = (index: number) => {
    setChevron((prev) => (prev === index ? -1 : index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId) return;
    try {
      if (tripId === "newTrip") {
        await tripApi.updateTrip(tripId, formData);
        setAlertIsVisible(true);
        setAlertDescription("cdvvfdn");
        setAlertTitle("sdsvsd");
      }
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  if (!trip && tripId !== "newTrip") return <div>Loading...</div>;

  return (
    <div className=" relative max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Trip</h1>
      {alertIsVisible && (
        //  <div className="absolute top-4 w-full flex items-center justify-center">
        //   <Alert
        //     color="success"
        //     description={alertDescription}
        //     isVisible={alertIsVisible}
        //     title={alertTitle}
        //     variant="faded"
        //     onClose={() => setAlertIsVisible(false)}
        //   />
        //   </div>
        <Alert severity="success">This is a success Alert.</Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Destination Address
          </label>
          <input
            type="text"
            name="destinationAddress"
            value={formData.destinationAddress}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="w-full flex justify-end">
          <Button
            onClick={handleAddNewTrip}
            className={`bg-gradient-to-tr rounded-full from-pink-500 to-yellow-500 text-white shadow-lg`}
            radius="full"
          >
            <Plus /> {!isMobile && "Add Trip"}
          </Button>
        </div>
        {formData?.Trips.length > 0 &&
          formData?.Trips?.map(
            (tripData: (typeof formData.Trips)[0], index: number) => (
              <div className="flex w-full justify-between">
                <div
                  key={index}
                  className="border p-4 w-full rounded-md space-y-4"
                >
                  <div
                    onClick={() => handleChangeChevron(index)}
                    className="w-full flex cursor-pointer justify-between"
                  >
                    <h2 className="font-semibold">Trip Details #{index + 1}</h2>
                    {chevron === index ? <ChevronDown /> : <ChevronUp />}
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${!(chevron === index) ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"}`}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          name={`Trips.${index}.price`}
                          value={tripData.price}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <input
                          type="date"
                          name={`Trips.${index}.date`}
                          value={
                            new Date(tripData.date).toISOString().split("T")[0]
                          }
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          name={`Trips.${index}.Status`}
                          value={tripData.Status}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="Active">Active</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Expiry">Expiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Seats Limit
                        </label>
                        <input
                          type="number"
                          name={`Trips.${index}.SeatsLimit`}
                          value={tripData.SeatsLimit}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bus Image URL
                        </label>
                        <input
                          type="text"
                          name={`Trips.${index}.busImage`}
                          value={tripData.busImage}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                        <img
                          src={tripData.busImage}
                          alt="but image"
                          className="md:w-80 md:h-80 w-20 h-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/4 flex items-center justify-center">
                  <button onClick={() => deleteTripByIndex(index)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            )
          )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
