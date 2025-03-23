"use client";

import { dbConnection } from "@/lib/db";
import Cookies from "@/subcomponents/Cookies";
import React, { useEffect } from "react";

function book() {
  
  useEffect(() => {
    const conn = async() =>{
    await dbConnection()
  }
  conn()
  }, [])

  return (
    <div className="w-full lg:p-16 p-6 mt-8">
      <div>
        <div className="lg:text-8xl text-4xl font-semibold">Book Your Seat</div>
        <div className="w-full lg:mt-24 mt-8 flex lg:flex-row flex-col justify-between lg:items-center gap-6">
          <div className=" lg:w-[50%] flex">   
             <span className=" lg:h-16 lg:w-16 h-12 w-12 flex  items-center justify-center lg:text-xl text-white bg-black rounded-full lg:p-4 p-2  ">
               300
             </span>
             <div className="p-4 lg:text-xl text-gray-500" >
              Book seculrly
             </div>
          </div>

          <div className="lg:w-[40%] lg:text-2xl text-md font-medium">
            Explore a selection of our crafted work combining unique designs and
            rich technology. We always build from scratch, creating memorable
            brands, engaging websites and digital products.
          </div>
        </div>
           <Cookies />
           <div>
             <div> 
             </div>
             <div>
             </div>
           </div>
      </div>
    </div>
  );
}

export default book;
