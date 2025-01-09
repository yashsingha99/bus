"use client";

import { Settings } from "lucide-react";
import React from "react";

const Cookies = () => {
  return (
    <div className="w-1/3 max-w-[300px] mx-auto p-4 px-8">
      <div className=" overflow-hidden w-1/3 max-w-[40%] bg-black rounded-2xl p-4 mx-auto">
        <div className=" z-[1] flex flex-wrap items-center justify-between gap-4">
          <div className="text-white text-sm md:text-base text-xl">
            We use cookies
          </div>
          <div className="relative flex items-center gap-4">
            <div className="cursor-pointer text-white">
              <Settings />
            </div>
            <div>
              <button className="px-4 py-2 rounded-3xl text-black bg-white hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                Accept
              </button>
              <div
                className="-z-[10] absolute  top-1/3 left-1/2  transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "600px",
                  height: "100px",
                  background:
                    "radial-gradient(circle, rgb(52, 56, 141) 0%, rgb(52, 56, 141) 30%, rgba(52, 56, 141) 60%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
