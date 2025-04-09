"use client";

import { LogOut, X, User, UserPlus } from "lucide-react";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import { useDrawerContext } from "@/context/DrawerContext";
import { useState, useEffect } from "react";
import "./drawer.css";
import Link from "next/link"
import { useNavigation } from "@/utils/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { FeedbackButton } from "./ui/feedback-button";


const Drawer = () => {
  const { isOpen, closeDrawer } = useDrawerContext();
  const [isVisible, setIsVisible] = useState(false);
  const { navigate } = useNavigation();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk()
  const navigation = [
    { page: "Home", navigate: "/" },
    { page: "Book", navigate: "book" },
    { page: "Ticket", navigate: "/tickets" },
    { page: "News", navigate: "/" },
    { page: "About", navigate: "/" },
  ]

  const adminNavigation = [
    { page: "Dashboard", navigate: "/admin" },
    { page: "Trips", navigate: "/admin/trips" },
    { page: "Users", navigate: "/admin/users" },
    { page: "Reserved Users", navigate: "/admin/reserved-users" },
    { page: "Settings", navigate: "/admin/settings" },
  ]
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);   
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    signOut();
    closeDrawer();
  };

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
              <button
                key={link.page}
                onClick={() => navigate(link.navigate)}
                className="block font-medium hover:text-white/80 text-left w-full"
              >
                {link.page}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="container mx-auto">
              <div className="relative flex flex-wrap w-full gap-4">
                {isSignedIn ? (
                  <>
                    <div className="w-full mb-4 p-4 bg-[#04051b] border border-[#545CFF] rounded-xl">
                      <div className="flex items-center gap-3">
                        {user?.imageUrl ? (
                          <img 
                            src={user.imageUrl} 
                            alt={user.fullName || 'User'} 
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#545CFF] flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.firstName?.[0] || user?.lastName?.[0] || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{user?.fullName || 'User'}</p>
                          <p className="text-white/70 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                      </div>
                    </div>
                    <FeedbackButton
                      onClick={handleSignOut} 
                      className="bg-[#04051b] cursor-pointer border-2 border-[#545CFF] flex items-center justify-center gap-2 hover:scale-110 text-white lg:w-60 lg:h-16 w-full h-10 rounded-xl lg:text-3xl text-xl"
                    >
                      <div className="w-[15%] flex items-center justify-center">
                        <LogOut />
                      </div>
                      Log Out
                    </FeedbackButton>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="w-full lg:w-60">
                      <FeedbackButton className="bg-[#04051b] cursor-pointer border-2 border-[#545CFF] flex items-center justify-center gap-2 hover:scale-110 text-white lg:h-16 h-10 rounded-xl lg:text-3xl text-xl w-full">
                        <div className="w-[15%] flex items-center justify-center">
                          <User />
                        </div>
                        Sign In
                      </FeedbackButton>
                    </Link>
                    <Link href="/sign-up" className="w-full lg:w-60">
                      <FeedbackButton className="bg-[#545CFF] cursor-pointer flex items-center justify-center gap-2 hover:scale-110 text-white lg:h-16 h-10 rounded-xl lg:text-3xl text-xl w-full">
                        <div className="w-[15%] flex items-center justify-center">
                          <UserPlus />
                        </div>
                        Sign Up
                      </FeedbackButton>
                    </Link>
                  </>
                )}
                <button className="bg-[#545CFF] cursor-pointer hover:scale-110 text-white lg:w-60 lg:h-16 w-full h-10 rounded-3xl lg:text-3xl text-xl">
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
