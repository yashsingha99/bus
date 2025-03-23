"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

function ClientFeedback() {
  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote: "All that we see or seem is but a dream within a dream.",
      name: "Edgar Allan Poe",
      title: "A Dream Within a Dream",
    },
    {
      quote:
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      name: "Jane Austen",
      title: "Pride and Prejudice",
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];
  return (
    <div className="bg-[#111111] w-full  flex flex-col items-center">
      <div className="container w-full relative pt-24 lg:p-8 p-2 text-white gap-10 flex flex-col items-center">
        {/* Background Element */}
        {/* <div className="absolute lg:w-[1000px] w-[400px] lg:h-[1500px] h-[400px] lg:top-[800px] top-[300px] lg:-left-80 -left-32 lg:blur-[150px] blur-[50px] bg-[#34388D] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div> */}

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
        <div className="flex flex-col w-full items-center mt-16 gap-16">
          {/* {[...Array(4)].map((_, index) => (
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
          ))} */}
          {/* <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"> */}
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          {/* </div> */}
        </div>

        {/* Second Background Element */}
        <div className="absolute lg:w-[200px] w-[50px] lg:h-[500px] h-[200px] lg:bottom-[-1500px] top-[1200px] lg:right-[-200px] right-[-20px] lg:blur-[150px] blur-[50px] bg-[#4750fa] rounded-t-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}

export default ClientFeedback;
