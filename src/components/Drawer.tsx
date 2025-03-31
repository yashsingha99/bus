"use client";

import { X } from "lucide-react";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import { useDrawerContext } from "@/context/DrawerContext";
import { useState, useEffect } from "react";

import "./drawer.css";

const navigation = [
  { page: "Home", navigate: "/" },
  { page: "Book", navigate: "book" },
  { page: "Ticket", navigate: "/" },
  { page: "News", navigate: "/" },
  { page: "About", navigate: "/" },
]

const Drawer = () => {
  const { isOpen, closeDrawer } = useDrawerContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true); // Trigger the animation
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed  inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <BackgroundBeamsWithCollision
        className={`relative -top-20 lg:h-[80%] lg:w-[50%] w-[90%] h-[70%] bg-black p-8 text-white rounded-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-medium">Navigation</h2>
            <button
              onClick={closeDrawer}
              className="text-white hover:text-white/80"
              aria-label="Close Drawer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-12 w-full overflow-auto scrollbar-none lg:space-y-6 space-y-4 lg:text-5xl text-3xl">
            {navigation.map((link) => (
              <a
                key={link.page}
                href={link.navigate}
                className="block font-medium hover:text-white/80"
              >
                {link.page}
              </a>
            ))}
          </nav>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="container mx-auto">
              <div className=" relative flex flex-col w-full gap-8">
                <button className="bg-[#545CFF] hover:scale-110 text-white lg:w-60 lg:h-16 w-full h-10 rounded-3xl lg:text-3xl text-xl">
                  Get in touch
                </button>
                <div
                  className={`absolute w-80 h-48 left-48 filter blur-[150px] bg-[#3e59dd]  shadow-[0_0_30px_rgba(247,146,30,0.6)] rounded-full transform -translate-x-1/2 -translate-y-1/2 `}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Drawer;
