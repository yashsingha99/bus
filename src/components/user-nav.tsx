"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogIn, Menu, User, Bus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { useDrawerContext } from "@/context/DrawerContext";
import Drawer from "./Drawer";
import useScreenSize from "@/hooks/use-screen-size";

export function UserNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isOpen, openDrawer } = useDrawerContext();
  const isMobile = useScreenSize();
  return (
    <div>
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <Link href="/notifications">
            <FeedbackButton variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </FeedbackButton>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="hidden md:flex md:gap-2">
          <Link href="/login">
            <FeedbackButton variant="ghost" size="lg">
              Log In
            </FeedbackButton>
          </Link>
          <Link href="/register">
            <FeedbackButton size="lg">Sign Up</FeedbackButton>
          </Link>
        </div>
      )}
      {!isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              {/* <Menu className="h-5 w-5" /> */}
              <Menu size={32} />

              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Bus className="h-5 w-5" />
                <span>BusBooking</span>
              </Link>
              <Link href="/search" className="hover:text-primary">
                Search
              </Link>
              <Link href="/routes" className="hover:text-primary">
                Routes
              </Link>
              <Link href="/offers" className="hover:text-primary">
                Offers
              </Link>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
              {!isLoggedIn && (
                <div className="flex flex-col gap-2 pt-4">
                  <Link href="/login">
                    <FeedbackButton
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Log In
                    </FeedbackButton>
                  </Link>
                  <Link href="/register">
                    <FeedbackButton className="w-full">Sign Up</FeedbackButton>
                  </Link>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <> 
         <button
              onClick={openDrawer}
              //  variant="outline"
              className="py-5 px-3 rounded-full border-gray-500"
            >
              <Menu size={32} />
          </button>
        </>
      )}

    </div>
      {/* {isOpen && } */}
    <Drawer />
    </div>
  );
}
