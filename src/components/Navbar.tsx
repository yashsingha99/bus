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
import Auth from "./model/auth";
const Navbar = () => {
  const { isOpen, openDrawer } = useDrawerContext();
  const { navigate } = useNavigation();

  const user = localStorage.getItem("user");
  console.log(user);
  
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
              {user !== null ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => navigate("/tickets")}
                    variant="outline"
                    className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
                  >
                    My Tickets
                  </Button>
                </div>
              ) : (
                <Auth navigateRoute="/tickets" callback={() => {}}>
                  <Button
                    variant="outline"
                    className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
                  >
                    My Tickets
                  </Button>
                </Auth>
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

