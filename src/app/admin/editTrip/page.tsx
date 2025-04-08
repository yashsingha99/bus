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
import { Trash2, Plus, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Interface matching the server data structure
interface ITripItem {
  _id?: string;
  price: number;
  Timing: string[];
  date: string;
  Status: string;
  SeatsLimit: number;
}

interface ITrip {
  _id?: string;
  destinationAddress: string;
  Trips: ITripItem[];
  createdAt?: string;
  updatedAt?: string;
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
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("0");
  const [error, setError] = useState<string | null>(null);

  function createEmptyTrip(): ITripItem {
    return {
      price: 0,
      Timing: [""],
      date: new Date().toISOString().split("T")[0],
      Status: "Active",
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
        
        const formattedData = {
          ...data,
          Trips: data.Trips.map((trip: ITripItem) => ({
            ...trip,
            date: new Date(trip.date).toISOString().split("T")[0],
          })),
        };
        
        setFormData(formattedData);
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

  const validateTrip = (trip: ITripItem) => {
    const tripErrors: Record<string, string> = {};
    if (!trip.price && trip.price !== 0) tripErrors.price = "Price is required";
    if (!trip.date) tripErrors.date = "Date is required";
    if (!trip.SeatsLimit && trip.SeatsLimit !== 0) tripErrors.SeatsLimit = "Seats limit is required";
    if (!trip.Timing || trip.Timing.length === 0 || trip.Timing.some((t: string) => !t)) {
      tripErrors.Timing = "At least one valid timing is required";
    }
    return tripErrors;
  };

  const validateForm = () => {
    if (!formData) return {};
    
    const err: Record<string, any> = {};
    if (!formData.destinationAddress)
      err.destinationAddress = "Destination is required";
    
    formData.Trips.forEach((trip, index) => {
      const tripErrors = validateTrip(trip);
      if (Object.keys(tripErrors).length) err[`trip-${index}`] = tripErrors;
    });
    return err;
  };

  const handleChange = (index: number, field: string, value: any) => {
    if (!formData) return;
    
    const updatedTrips = [...formData.Trips];
    updatedTrips[index] = { ...updatedTrips[index], [field]: value };
    setFormData({ ...formData, Trips: updatedTrips });
    
    // Clear error for this field if it exists
    if (errors[`trip-${index}`]?.[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`trip-${index}`][field];
      if (Object.keys(updatedErrors[`trip-${index}`]).length === 0) {
        delete updatedErrors[`trip-${index}`];
      }
      setErrors(updatedErrors);
    }
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
      toast.error("Please fix errors in the current trip before adding a new one");
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
    const currentTimings = updatedTrips[tripIndex].Timing || [""];
    updatedTrips[tripIndex] = { 
      ...updatedTrips[tripIndex], 
      Timing: [...currentTimings, ""]
    };
    setFormData({ ...formData, Trips: updatedTrips });
  };

  const handleTimingChange = (tripIndex: number, timingIndex: number, value: string) => {
    if (!formData) return;
    
    const updatedTrips = [...formData.Trips];
    const currentTimings = [...updatedTrips[tripIndex].Timing];
    currentTimings[timingIndex] = value;
    updatedTrips[tripIndex] = { ...updatedTrips[tripIndex], Timing: currentTimings };
    setFormData({ ...formData, Trips: updatedTrips });
    
    // Clear timing error if it exists
    if (errors[`trip-${tripIndex}`]?.Timing) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`trip-${tripIndex}`].Timing;
      if (Object.keys(updatedErrors[`trip-${tripIndex}`]).length === 0) {
        delete updatedErrors[`trip-${tripIndex}`];
      }
      setErrors(updatedErrors);
    }
  };

  const handleDeleteTiming = (tripIndex: number, timingIndex: number) => {
    if (!formData) return;
    
    const updatedTrips = [...formData.Trips];
    const currentTimings = [...updatedTrips[tripIndex].Timing];
    
    if (currentTimings.length <= 1) return;
    
    currentTimings.splice(timingIndex, 1);
    updatedTrips[tripIndex] = { ...updatedTrips[tripIndex], Timing: currentTimings };
    setFormData({ ...formData, Trips: updatedTrips });
  };

  const prepareDataForSaving = () => {
    if (!formData) return null;
    
    const dataToSave = { ...formData };
    
    dataToSave.Trips = dataToSave.Trips.map(trip => ({
      ...trip,
      price: Number(trip.price),
      SeatsLimit: Number(trip.SeatsLimit),
      Timing: trip.Timing.filter(t => t.trim() !== "")
    }));
    
    return dataToSave;
  };

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
        await tripApi.createTrip(dataToSave );
        toast.success("Trip created successfully");
        router.push("/admin/trips");
      } else {
        // Update existing trip
        await tripApi.updateTrip(tripId, dataToSave);
        toast.success("Trip updated successfully");
        router.push("/admin/trips");
      }
    } catch (err) {
      console.error("Error submitting trip:", err);
      toast.error("Failed to save trip. Please try again.");
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
          <Button onClick={() => router.push("/admin/trips")}>
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
          <Button onClick={() => router.push("/admin/trips")}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {tripId === "newTrip" ? "Create New Trip" : "Edit Trip"}
      </h2>
      
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
                        value={trip.date}
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
                          handleChange(index, "SeatsLimit", Number(e.target.value))
                        }
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
                      <Label>Timings</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTiming(index)}
                        className="flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Time
                      </Button>
                    </div>
                    
                    {errors[`trip-${index}`]?.Timing && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors[`trip-${index}`].Timing}
                      </p>
                    )}
                    
                    {(trip.Timing || [""]).map((timing, timingIndex) => (
                      <div key={timingIndex} className="flex items-center mb-2">
                        <Input
                          type="time"
                          value={timing}
                          onChange={(e) => handleTimingChange(index, timingIndex, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTiming(index, timingIndex)}
                          className="ml-2"
                          disabled={(trip.Timing || []).length <= 1}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
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