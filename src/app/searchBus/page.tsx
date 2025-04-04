"use client";

import { dbConnection } from "@/lib/db";
import Cookies from "@/subcomponents/Cookies";
import { MoveLeft } from "lucide-react";
import React, { useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import { useSearchParams } from "next/navigation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { tripApi } from "@/API/trip.api";
import { ITrip } from "@/model/trip.model";

function book() {

  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup");
  const tripId = searchParams.get("destination");
  
  const fetchTrip = async () => {
  if (tripId && typeof tripId === "string") {  
    try {
      const res = await tripApi.getTripById(tripId);
      console.log(res); 
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  }
};


  useEffect(() => {
   fetchTrip()
  }, []);
  return (
    <div className="">
      <div className="">
        {/* <IconButton aria-label="delete" variant="outlined">
          <KeyboardBackspaceIcon />
        </IconButton> */}
      </div>
    </div>
  );
}

export default book;
