"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from '../components/ui/button';
import Drawer from "./Drawer";
import { useState } from "react";
import { useDrawerContext } from "@/context/DrawerContext";

// import LightEffectSpread from '@/subcomponents/Light-Effect';
const Navbar = () => {
  const {isOpen, openDrawer } = useDrawerContext();

  return (
    <header className="w-full ">
      <div className="container mx-auto px-4 ">
        <nav className="flex items-center justify-between">
          <a href="/" className="lg:text-3xl text-2xl font-bold tracking-tight">
            Bustify
          </a>
          {/* <LightEffectSpread /> */}

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
            >
              Get in touch
            </Button>

            <button
              onClick={openDrawer}
              //  variant="outline"
              className="py-5 px-3 rounded-full border-gray-500"
            >
              <Menu size={32} />
            </button>
          </div>
        </nav>
      </div>
      {isOpen && <Drawer />}
    </header>
  );
};

export default Navbar;
