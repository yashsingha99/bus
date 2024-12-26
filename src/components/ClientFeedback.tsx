"use client";

import React from "react";

function ClientFeedback() {
  return (
    <div className="bg-[#111111] w-full  flex flex-col items-center">
      <div className="container relative pt-24 lg:p-8 p-2 text-white gap-10 flex flex-col items-center">
        {/* Background Element */}
        <div className="absolute lg:w-[1000px] w-[400px] lg:h-[1500px] h-[400px] lg:top-[800px] top-[300px] lg:-left-80 -left-32 lg:blur-[150px] blur-[50px] bg-[#34388D] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Header */}
        <div className="z-10 lg:text-5xl text-3xl font-semibold text-white">
          Client Feedback
        </div>

        {/* Subtext */}
        <div className="z-10 lg:mt-12 flex justify-between text-white">
          <div className="lg:text-2xl text-lg text-center">
            We’re collaborators - We build tight-knit partnerships with our
            clients.
          </div>
          <div className="text-[#898991] text-2xl hidden lg:block">
            Keep scrolling
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="flex flex-col items-center mt-16 gap-16">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="w-[80%] lg:p-16 p-8 border rounded-2xl"
            >
              <div className="lg:text-2xl text-md mt-8 lg:font-bold">
                "We have worked with Artistsweb to build a complete new website
                with quite complex connections with our CRM and accounting
                functions. The end product is brilliant, a really first-class
                blend of design and functionality, and the speed and depth of
                understanding about our business was remarkable. I’d highly
                recommend them."
              </div>
              <div className="flex lg:mt-16 mt-4 gap-4">
                <div className="rounded-full lg:p-3 p-2 border lg:text-2xl bg-white text-blue-900 font-bold">
                  SG
                </div>
                <div className="text-gray-400 lg:text-2xl lg:p-3 p-2">
                  Steven Glibbery
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Background Element */}
        <div className="absolute lg:w-[200px] w-[50px] lg:h-[500px] h-[200px] lg:bottom-[-1500px] top-[1200px] lg:right-[-200px] right-[-20px] lg:blur-[150px] blur-[50px] bg-[#4750fa] rounded-t-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}

export default ClientFeedback;
