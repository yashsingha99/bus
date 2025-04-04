"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "./ui/select";
import { FormControl } from "./ui/form";
import { SelectGroup } from "@radix-ui/react-select";
import { tripApi } from "@/API/trip.api";
interface DataSchema {
  pickUp: string;
  destination: string;
}

function SearchCard() {
  const [roundTripData, setRoundTripData] = useState<DataSchema>({
    pickUp: "",
    destination: "",
  });

  const [oneWayData, setOneWayData] = useState<DataSchema>({
    pickUp: "",
    destination: "",
  });

  const [destinationData, setDestinationData] = useState<
    { _id: string; destinationAddress: string }[] | null
  >(null);
  const pickupLocations = [
    "GLA University (GLAU)",
    "Jait (JAIT)",
    "Krishana Vally (KV)",
    "Chattikara  (CK)",
    "Goverdhan Choraha (GOV CH)",
  ];
  function handleChangeData(
    stateLabel: string,
    dataLabel: string,
    data: string
  ) {
    if (stateLabel === "round-trip") {
      setRoundTripData((prev) => ({ ...prev, [dataLabel]: data }));
    } else {
      setOneWayData((prev) => ({ ...prev, [dataLabel]: data }));
    }
  }
  const router = useRouter();
   const handleNavigate = () => {
      router.push(`/searchBus?pickup=${roundTripData.pickUp}&destination=${roundTripData.destination}`);
   }

  const fetchTripsName = async () => {
    try {
      const res = await tripApi.getTripNames(); // API likely returns an array
      console.log(res);

      if (Array.isArray(res)) {
        setDestinationData(res); // Set array correctly
      } else {
        console.error("Unexpected API response format:", res);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    fetchTripsName();
  }, []);
  return (
    <div className="flex items-center justify-center">
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
                <div className="flex flex-wrap justify-center  gap-4">
                  <Select
                    defaultValue={roundTripData.pickUp}
                    onValueChange={(value) =>
                      handleChangeData("round-trip", "pickUp", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick-up location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mathura</SelectLabel>
                        {pickupLocations?.map((pickUp) => (
                          <SelectItem value={pickUp}>{pickUp}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    defaultValue={roundTripData.destination}
                    onValueChange={(value) =>
                      handleChangeData("round-trip", "destination", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Neptel Centers</SelectLabel>
                        {destinationData?.map((dest) => (
                          <SelectItem value={dest._id}>
                            {dest.destinationAddress}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                 
                <FeedbackButton onClick={handleNavigate} className="w-full">
                  Search Buses
                  <Search className="ml-2 h-4 w-4" />
                </FeedbackButton>
              </div>
            </TabsContent>
            <TabsContent value="one-way" className="space-y-4">
              <div className="flex items-center justify-center">
                Will be release soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default SearchCard;
