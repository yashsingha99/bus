"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackButton } from "./ui/feedback-button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "./ui/select";
import { tripApi } from "@/API/trip.api";
// import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "sonner";
interface DataSchema {
  pickUp: string;
  destination: string;
}

interface TripData {
  _id: string;
  destinationAddress: string;
}

export const pickupLocations = [
    "GLA University",
    "Krishna Valley",
    "Chattikara",
    "Maheshwari Chauraha",
    "Goverdhan Chauraha",
    "Township"
  ];

// function SearchCardSkeleton() {
//   return (
//     <div className="flex items-center justify-center">
//       <Card className="w-full">
//         <CardHeader>
//           <Skeleton className="h-6 w-32" />
//           <Skeleton className="h-4 w-48 mt-2" />
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex gap-2">
//               <Skeleton className="h-10 w-1/2" />
//               <Skeleton className="h-10 w-1/2" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-10 w-full" />
//             </div>
//             <Skeleton className="h-10 w-full" />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

function SearchCard() {
  // const [isLoading, setIsLoading] = useState(true);
  const [roundTripData, setRoundTripData] = useState<DataSchema>({
    pickUp: "",
    destination: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [destinationData, setDestinationData] = useState<TripData[] | null>(null);

  const router = useRouter();

  function handleChangeData(
    stateLabel: "round-trip" | "one-way",
    dataLabel: keyof DataSchema,
    data: string
  ) {
    setRoundTripData((prev) => ({ ...prev, [dataLabel]: data }));
  }

  const handleNavigate = () => {
    if (!roundTripData.pickUp || !roundTripData.destination) {
      toast.error("Please select both pickup and destination locations");
      return;
    }
    
    setIsSearching(true);
    router.push(
      `/searchBus/source?pickup=${roundTripData.pickUp}&destination=${roundTripData.destination}`
    );
  };

  const fetchTripsName = async () => {
    try {
      // setIsLoading(true);
      // setError(null);
      const res = await tripApi.getTripNames();
    //  console.log(res);
     
      if (Array.isArray(res)) {
        setDestinationData(res);
      } else {
        // setError("Failed to load destinations");
        console.error("Unexpected API response format:", res);
      }
    } catch (error) {
      // setError("Failed to load destinations");
      console.error("Error fetching trips:", error);
    } 
    // finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    fetchTripsName();
  }, []);

  // if (isLoading) {
  //   return <SearchCardSkeleton />;
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center p-4">
  //       <div className="text-red-500">{error}</div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quick Search</CardTitle>
          <CardDescription>Find buses for your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="round-trip" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
              <TabsTrigger value="one-way">One Way</TabsTrigger>
            </TabsList>
            <TabsContent value="round-trip" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                  <Select
                    defaultValue={roundTripData.pickUp}
                    onValueChange={(value) =>
                      handleChangeData("round-trip", "pickUp", value)
                    }
                    aria-label="Pick-up location"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick-up location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mathura</SelectLabel>
                        {pickupLocations?.map((pickUp) => (
                          <SelectItem key={pickUp} value={pickUp}>
                            {pickUp}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    defaultValue={roundTripData.destination}
                    onValueChange={(value) =>
                      handleChangeData("round-trip", "destination", value)
                    }
                    aria-label="Destination"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Nptel Center</SelectLabel>
                        {destinationData?.map((dest) => (
                          <SelectItem key={dest._id} value={dest._id}>
                            {dest.destinationAddress}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <FeedbackButton 
                  onClick={handleNavigate} 
                  className="w-full"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search Buses"}
                  <Search className="ml-2 h-4 w-4" />
                </FeedbackButton>
              </div>
            </TabsContent>
            <TabsContent value="one-way" className="space-y-4">
              <div className="flex items-center justify-center">
                Will be released soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default SearchCard;
