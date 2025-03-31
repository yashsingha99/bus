"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import useScreenSize from "@/hooks/use-screen-size";
import { ITrip } from "@/model/trip.model";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";
import { tripApi } from "../../../API/trip.api";

function page() {
  const isMobile = useScreenSize();
  const router = useRouter();
  const [trips, setTrips] = useState<ITrip[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const fetchTrips = async () => {
    try {
      const data = await tripApi.getAllTrips();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="w-[1/2] flex">
          <div className="w-full justify-start">
            <PlaceholdersAndVanishInput
              placeholders={["I've got your trip—search in me!"]}
              onChange={handleChange}
              onSubmit={onSubmit}
              styleInput="w-[50%]"
            />
          </div>
          <Button
            onPress={() => {
                  router.push(`/admin/editTrip?tripId=newTrip`);
              }} 
            className={`bg-gradient-to-tr rounded-full from-pink-500 to-yellow-500 text-white shadow-lg`}
            radius="full"
          >
            <Plus /> {!isMobile && "Add Trip"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-8">
          {trips.map((trip, index) => (
            <div key={index} className="relative rounded-3xl border">
              <div className="">
                <img 
                  src="https://images.pexels.com/photos/29702987/pexels-photo-29702987/free-photo-of-luxury-tour-bus-parked-on-street-in-daylight.jpeg" 
                  alt="" 
                  className="rounded-t-2xl" 
                  width="300px" 
                  height="200px" 
                />
                <div>
                  <div>{trip.destinationAddress}</div>
                </div>
              </div>
              <Button 
                onPress={() => {
                  router.push(`/admin/editTrip?tripId=${trip._id}`);
                }} 
                className="flex items-center justify-center absolute top-2 shadow-2xl right-2 cursor-pointer rounded-full border-2 border-red-600 w-10 h-10 bg-red-200 hover:bg-red-300"
              >
                <Pencil className="text-red-600"/>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
