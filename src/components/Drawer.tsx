"use client";

import { X } from "lucide-react";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import { useDrawerContext } from "@/context/DrawerContext";
import { useState, useEffect } from "react";
import "./drawer.css";
import { useNavigation } from "@/utils/navigation";
// import Auth from "./model/auth";
// import { Button } from "./ui/button";
const Drawer = () => {
  const { isOpen, closeDrawer } = useDrawerContext();
  const [isVisible, setIsVisible] = useState(false);
  const { navigate } = useNavigation();
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString || "{}") : null;
  const navigation = [
    { page: "Home", navigate: "/" },
    { page: "Book", navigate: "/searchBus" },
    { page: "Ticket", navigate: "/tickets" },
    { page: "Contact", navigate: "/contact" },
    { page: "About", navigate: "/about" },
  ];

  const adminNavigation = [
    { page: "Dashboard", navigate: "/AATUadmin" },
    { page: "Trips", navigate: "/AATUadmin/trips" },
    { page: "Users", navigate: "/AATUadmin/users" },
    { page: "Reserved", navigate: "/AATUadmin/reserved-users" },
    // { page: "Settings", navigate: "/AATUadmin/settings" },
  ];
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    closeDrawer();
    window.location.reload()
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed  inset-0 z-max flex items-center justify-center backdrop-blur-sm bg-black/50 transition-opacity duration-300 ${
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
              className="text-gray-100 bg-gray-800 p-2 rounded-full hover:text-white/80"
              aria-label="Close Drawer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {userData && (
            <div className="text-sm text-green-500 w-full flex items-center"> Hey, {userData?.fullName}</div>
          )}

          <nav className="mt-4 w-full flex justify-around overflow-auto scrollbar-none lg:space-y-6 space-y-4 lg:text-5xl text-3xl">
            <div className="flex flex-col gap-4">
              {navigation.map((link) => (
                <button
                  key={link.page}
                  onClick={() => navigate(link.navigate)}
                  className="block lg:text-4xl  text-[20px] font-medium hover:text-white/80 text-left w-full"
                >
                  {link.page}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {userData &&
                userData.role === "IAMADMINROCK" &&
                adminNavigation.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => navigate(link.navigate)}
                    className="block lg:text-4xl  text-[20px] font-medium hover:text-white/80 text-left w-full"
                  >
                    {link.page}
                  </button>
                ))}
            </div>
          </nav>

          <div className="absolute bottom-8 left-8 right-8 z-20">
            <div className="container mx-auto">
              <div className="relative flex flex-wrap w-full gap-4">
                {userData && (
                  <>
                    <button
                      onClick={handleSignOut}
                      className="bg-[#04051b] lg:cursor-pointer border-2 border-[#545CFF] flex items-center justify-center gap-2 hover:scale-110 text-white lg:w-60 lg:h-16 lg:rounded-xl w-full h-10 rounded-xl lg:text-3xl text-xl"
                    >
                      Log Out
                    </button>
                  </>
                )}
                {/* : (
                  <>
                    <Auth
                      navigateRoute=""
                      callback={[
                        () => {
                          window.location.reload();
                          
                        },
                      ]}
                      state={() => {}}
                    >
                      <Button
                      onClick={()=>{closeDrawer()}}
                       className="bg-[#04051b] lg:cursor-pointer border-2 border-[#545CFF] flex items-center justify-center gap-2 hover:scale-110 text-white lg:h-16 h-10 rounded-xl lg:text-3xl text-xl w-full">
                        Sign In
                      </Button>
                    </Auth>
                  </>
                )} */}

                {/* <button className="bg-[#545CFF] cursor-pointer hover:scale-110 text-white lg:w-60 lg:h-16 w-full h-10 rounded-3xl lg:text-3xl text-xl">
                  Get in touch
                </button> */}

                {/* <div
                  className={`absolute w-80 h-48 z-10 left-48 filter blur-[150px] bg-[#3e59dd]  shadow-[0_0_30px_rgba(247,146,30,0.6)] rounded-full transform -translate-x-1/2 -translate-y-1/2 `}
                ></div> */}
              </div>
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Drawer;
