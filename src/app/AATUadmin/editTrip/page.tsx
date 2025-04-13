"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, X, AlertCircle, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast, Toaster } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITrip, SingleTrip } from "@/model/trip.model";
import mongoose from "mongoose";

// Interface matching the server data structure
// interface ITripItem {
//   _id?: string;
//   price: number;
//   Timing: string[];
//   date: string;
//   Status: string;
//   SeatsLimit: number;
// }

enum Status {
  Active = "Active",
  Upcoming = "Upcoming",
  Expiry = "Expiry",
}

// interface SingleTrip {
//   _id: string;
//   price: number;
//   Timing: [string];
//   date: string;
//   Status: Status;
//   SeatsLimit: number;
// }

// interface ITripUpdate {
//   _id: string;
//   destinationAddress: string;
//   Trips: SingleTrip[];
// }
// interface ITrip {
//   _id: string;
//   destinationAddress: string;
//   Trips: SingleTrip[];
// }

// interface ITrip {
//   _id?: string;
//   destinationAddress: string;
//   Trips: ITripItem[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// Interface for API data

// interface ITripApiData {
//   destinationAddress: string;
//   Trips: {
//     price: number;
//     Timing: string[];
//     date: string;
//     Status: string;
//     SeatsLimit: number;
//   }[];
// }

interface ValidationErrors {
  _id?: string;
  price?: string;
  Timing?: string;
  date?: string;
  Status?: string;
  SeatsLimit?: string;
}

interface FormErrors {
  destinationAddress?: string;
  [key: `trip-${number}`]: ValidationErrors;
}

function EditTripSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Skeleton className="h-8 w-64 mb-4" />

      <div className="mb-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="mt-6">
        <div className="border-b">
          <div className="flex pb-2">
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <Card className="mt-4">
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
            </div>

            <div className="pt-2">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default function EditTripPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get("tripId");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ITrip | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState("0");
  const [error, setError] = useState<string | null>(null);
//  const [user, setUser] = useState<User | null>(null);
 useEffect(() => {
   if (typeof window !== "undefined") {
     const userString = localStorage.getItem("user");
     const userData = userString ? JSON.parse(userString) : null;
     if(userData.role !== "ADMIN"){
      router.push("/")
     }
    //  setUser(userData);
   }
 }, [router]);

  function createEmptyTrip(): SingleTrip {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      price: 0,
      Timing: ["forenoon"] as [string],
      date: new Date(),
      Status: Status.Active,
      SeatsLimit: 0,
    };
  }


  useEffect(() => {
    if (!tripId) {
      setError("No trip ID provided");
      setIsLoading(false);
      return;
    }

    if (tripId === "newTrip") {
      // Initialize new trip form
      const initialTrip: ITrip = {
        destinationAddress: "",
        Trips: [createEmptyTrip()],
      };
      setFormData(initialTrip);
      setIsLoading(false);
      return;
    }

    // Fetch existing trip data
    const fetchTrip = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tripApi.getTripById(tripId);
        console.log(data);
        
        // const formattedData: ITrip = {
        //   _id: String(data._id),
        //   destinationAddress: data.destinationAddress,
          
        //   Trips: data.Trips.map((trip) => ({
        //     ...trip,
        //     date:
        //       trip.date instanceof Date
        //         ? trip.date.toISOString().split("T")[0]
        //         : new Date(trip.date).toISOString().split("T")[0],
        //     SeatsLimit: Number(trip.SeatsLimit),
        //   })),
        // };

        setFormData(data);
      } catch (err) {
        console.error("Trip fetch error:", err);
        setError("Failed to load trip data. Please try again later.");
        toast.error("Failed to load trip data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const validateTrip = (trip: SingleTrip) => {
    const validationErrors: ValidationErrors = {};
    if (!trip.price && trip.price !== 0)
      validationErrors.price = "Price is required";
    if (!trip.date) validationErrors.date = "Date is required";
    if (!trip.Status) validationErrors.Status = "Status is required";
    if (!trip.SeatsLimit)
      validationErrors.SeatsLimit = "Seats limit is required";
    if (!trip.Timing)
      validationErrors.Timing = "At least one timing is required";
    return validationErrors;
  };

  const validateForm = () => {
    if (!formData) return {};

    const formValidationErrors: FormErrors = {};
    if (!formData.destinationAddress)
      formValidationErrors.destinationAddress = "Destination is required";

    formData.Trips.forEach((trip, index) => {
      const tripValidationErrors = validateTrip(trip);
      if (Object.keys(tripValidationErrors).length)
        formValidationErrors[`trip-${index}`] = tripValidationErrors;
    });
    return formValidationErrors;
  };

  const handleChange = (
    index: number,
    field: Exclude<keyof SingleTrip, "_id">,
    value: string | number | string[]
  ) => {
    if (!formData) return;

    const updatedTrips = [...formData.Trips];
    updatedTrips[index] = {
      ...updatedTrips[index],
      [field]: value,
    };
    setFormData({ ...formData, Trips: updatedTrips });
  };

  const handleDeleteTrip = (index: number) => {
    if (!formData || formData.Trips.length <= 1) return;

    const updated = [...formData.Trips];
    updated.splice(index, 1);
    setFormData({ ...formData, Trips: updated });

    // If we deleted the active tab, select the previous tab
    if (parseInt(activeTab) >= updated.length) {
      setActiveTab((updated.length - 1).toString());
    }
  };

  const handleAddTrip = () => {
    if (!formData) return;

    // Validate last trip before adding a new one
    const lastTrip = formData.Trips[formData.Trips.length - 1];
    const lastErrors = validateTrip(lastTrip);
    if (Object.keys(lastErrors).length) {
      setErrors((prev) => ({
        ...prev,
        [`trip-${formData.Trips.length - 1}`]: lastErrors,
      }));
      toast.error(
        "Please fix errors in the current trip before adding a new one"
      );
      return;
    }

    const newTrips = [...formData.Trips, createEmptyTrip()];
    setFormData({ ...formData, Trips: newTrips });
    setActiveTab((newTrips.length - 1).toString());
  };

  // Handle multiple timing selection
  const handleAddTiming = (tripIndex: number) => {
    if (!formData) return;

    const updatedTrips = [...formData.Trips];
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      // @ts-expect-error-ignore
      Timing: [...updatedTrips[tripIndex].Timing, ""],
    };
    setFormData({ ...formData, Trips: updatedTrips });
  };

  const handleTimingChange = (
    tripIndex: number,
    timingIndex: number,
    value: string
  ) => {
    if (!formData) return;

    const updatedTrips = [...formData.Trips];
    updatedTrips[tripIndex].Timing[timingIndex] = value;

    setFormData({ ...formData, Trips: updatedTrips });
  };

  const handleDeleteTiming = (tripIndex: number) => {
    if (!formData) return;
    const updatedTrips = [...formData.Trips];
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      Timing: [""] as [string],
    };
    setFormData({ ...formData, Trips: updatedTrips });
  };

  const prepareDataForSaving = () => {
    if (!formData) return null;

    // Create a trip object for the API
    const apiTrip: ITrip = {
      // _id: "d23",
      destinationAddress: formData.destinationAddress,
      Trips: formData.Trips.map((trip) => ({
        // _id: String(trip._id),
        price: Number(trip.price),
        Timing: trip.Timing,
        date: trip.date,
        Status: trip.Status,
        SeatsLimit: Number(trip.SeatsLimit),
      })),
    };

    return apiTrip;
  };

  // const prepareDataForUpdateing = () => {
  //   if (!formData) return null;

  //   // Create a trip object for the API
  //   const apiTrip: ITripUpdate = {
  //     _id:formData._id,
  //     destinationAddress: formData.destinationAddress,
  //     Trips: formData.Trips.map((trip) => ({
  //       price: Number(trip.price),
  //       Timing: trip.Timing,
  //       date: trip.date,
  //       Status: trip.Status,
  //       SeatsLimit: Number(trip.SeatsLimit),
  //     })),
  //   };

  //   return apiTrip;
  // };
 

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      const dataToSave = prepareDataForSaving();
      if (!dataToSave) return;

      setIsSubmitting(true);

      if (tripId === "newTrip") {
        // Create new trip
        await tripApi.createTrip(dataToSave);
        toast.success("Trip created successfully");
        router.push("/AATUadmin/trips");
      } else if (tripId) {
        // Update existing trip
        await tripApi.updateTrip(dataToSave);
        toast.success("Trip updated successfully");
        router.push("/AATUadmin/trips");
      }
    } catch (err) {
      console.error("Error submitting trip:", err);
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDestination = async () => {
    if (!tripId || tripId === "newTrip") {
      router.push("/AATUadmin/trips");
      return;
    }

    try {
      setIsSubmitting(true);
      await tripApi.deleteTrip(tripId);
      toast.success("Destination deleted successfully");
      router.push("/AATUadmin/trips");
    } catch (err) {
      console.error("Error deleting destination:", err);
      toast.error("Failed to delete destination. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <EditTripSkeleton />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/AATUadmin/trips")}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No trip data available</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/AATUadmin/trips")}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {tripId === "newTrip" ? "Create New Trip" : "Edit Trip"}
        </h2>
        {tripId !== "newTrip" && (
          <Button
            variant="destructive"
            onClick={handleDeleteDestination}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete Destination
          </Button>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="destination">Destination Address</Label>
        <Input
          id="destination"
          value={formData.destinationAddress || ""}
          onChange={(e) => {
            setFormData({ ...formData, destinationAddress: e.target.value });
            // Clear error if it exists
            if (errors.destinationAddress) {
              const updatedErrors = { ...errors };
              delete updatedErrors.destinationAddress;
              setErrors(updatedErrors);
            }
          }}
        />
        {errors.destinationAddress && (
          <p className="text-red-500 text-sm">{errors.destinationAddress}</p>
        )}
      </div>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full overflow-x-auto flex pb-2">
              {formData.Trips.map((_, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="whitespace-nowrap"
                >
                  Trip #{index + 1}
                </TabsTrigger>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTrip}
                className="ml-2 flex items-center gap-1"
                size="sm"
              >
                <Plus size={16} /> Add Trip
              </Button>
            </TabsList>
          </div>

          {formData.Trips.map((trip, index) => (
            <TabsContent key={index} value={index.toString()}>
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`price-${index}`}>Price</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        value={trip.price}
                        onChange={(e) =>
                          handleChange(index, "price", Number(e.target.value))
                        }
                        max={1000000}
                        min={1}
                      />
                      {errors[`trip-${index}`]?.price && (
                        <p className="text-red-500 text-sm">
                          {errors[`trip-${index}`].price}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`date-${index}`}>Date</Label>
                      <Input
                        id={`date-${index}`}
                        type="date"
                        value={new Date(trip.date).toISOString().split('T')[0]}
                        onChange={(e) =>
                          handleChange(index, "date", e.target.value)
                        }
                      />
                      {errors[`trip-${index}`]?.date && (
                        <p className="text-red-500 text-sm">
                          {errors[`trip-${index}`].date}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`status-${index}`}>Status</Label>
                      <select
                        id={`status-${index}`}
                        className="w-full border rounded p-2"
                        value={trip.Status}
                        onChange={(e) =>
                          handleChange(index, "Status", e.target.value)
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Expiry">Expiry</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`seats-${index}`}>Seats Limit</Label>
                      <Input
                        id={`seats-${index}`}
                        type="number"
                        value={trip.SeatsLimit}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "SeatsLimit",
                            Number(e.target.value)
                          )
                        }
                        max={1000000}
                        min={1}
                      />
                      {errors[`trip-${index}`]?.SeatsLimit && (
                        <p className="text-red-500 text-sm">
                          {errors[`trip-${index}`].SeatsLimit}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Timing</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTiming(index)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Timing
                      </Button>
                    </div>
                  </div>

                  <div>
                    {trip.Timing.map((timing, timingIndex) => (
                      <div key={timingIndex} className="flex gap-2 mb-2">
                        <Select
                          value={timing}
                          onValueChange={(value) =>
                            handleTimingChange(index, timingIndex, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forenoon">
                              Forenoon (9 AM - 12 PM)
                            </SelectItem>
                            <SelectItem value="afternoon">
                              Afternoon (2 PM - 5 PM)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {trip.Timing.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDeleteTiming(index)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {errors[`trip-${index}`]?.Timing && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[`trip-${index}`].Timing}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteTrip(index)}
                      className="flex items-center gap-1"
                      disabled={formData.Trips.length <= 1}
                    >
                      <Trash2 size={16} /> Delete Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="flex justify-end mt-6">
        <FeedbackButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Trip"}
        </FeedbackButton>
      </div>
    </div>
  );
}
