"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import Drawer from "./Drawer";
import { useDrawerContext } from "@/context/DrawerContext";
import { MainNav } from "./main-nav";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useNavigation } from "@/utils/navigation";
// import LightEffectSpread from '@/subcomponents/Light-Effect';
const Navbar = () => {
  const { isOpen, openDrawer } = useDrawerContext();
  const { navigate } = useNavigation();
  const { isSignedIn, user } = useUser();

  return (
    <header className="w-full ">
      <div className="container mx-auto px-4 ">
        <header className="sticky  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="flex items-center justify-between">
            <Link
              href="/"
              className="lg:text-3xl text-2xl font-bold tracking-tight"
            >
              Bustify
            </Link>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.username || 'User'}
                  </span>
                  <Button
                    onClick={() => navigate("/ticket")}
                    variant="outline"
                    className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
                  >
                    My Tickets
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate("/sign-in")}
                  variant="outline"
                  className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
                >
                  Sign In
                </Button>
              )}

              <button
                onClick={openDrawer}
                //  variant="outline"
                className="py-5 px-3 rounded-full border-gray-500"
              >
                <Menu size={32} />
              </button>
            </div>
          </nav>
          {/* <MainNav /> */}
        </header>
      </div>
      {isOpen && <Drawer />}
    </header>
  );
};

export default Navbar;
