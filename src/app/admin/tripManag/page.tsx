"use client";

import { Plus } from "lucide-react";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import useScreenSize from "@/hooks/use-screen-size";
import axios from "axios";
import { ITrip } from "@/model/trip.model";
// import InputSearch from "@/components/ui/input-search";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
const URL = process.env.VERCEL_URL || "http://localhost:3000";

function page() {
  const isMobile = useScreenSize();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  // console.log(URL);

  const [trips, setTrips] = useState<ITrip[]>([]);
  const fetchTrips = async () => {
    try {
      const res = await axios.get<{ data: ITrip[] }>(`${URL}/api/admin/trip`);
      setTrips([...trips, ...res.data.data]);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(trips);

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
        <div className="w-[1/2] flex  ">
          <div className="w-full justify-start">
            <PlaceholdersAndVanishInput
              placeholders={["I've got your trip—search in me!"]}
              onChange={handleChange}
              onSubmit={onSubmit}
              styleInput="w-[50%]"
            />
          </div>
          <Button
            className={`bg-gradient-to-tr rounded-full from-pink-500 to-yellow-500 text-white shadow-lg`}
            radius="full"
          >
            <Plus /> {!isMobile && "Add Trip"}
          </Button>
        </div>
        <div className="flex flex-wrap ">
          {trips.map((trip, index) => {
            return (
              <div key={index}>
                <FollowerPointerCard title={trip.destinationAddress}>
                  <div>{trip.destinationAddress}</div>
                </FollowerPointerCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default page;
