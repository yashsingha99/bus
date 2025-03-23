"use client";

import { Plus } from "lucide-react";
import { Button } from "@heroui/button";
import React from "react";
import useScreenSize from "@/hooks/use-screen-size";
// import InputSearch from "@/components/ui/input-search";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
function page() {
  const isMobile = useScreenSize();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="w-full">
      <div className="w-full">
        <div className="w-full flex">
          <PlaceholdersAndVanishInput 
            placeholders={["I’ve got your trip—search in me!"]}
            onChange={handleChange}
            onSubmit={onSubmit}
            styleInput="w-1/2"
          />
          <Button
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            radius="full"
          >
            <Plus /> {!isMobile && "Add Trip"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page;
