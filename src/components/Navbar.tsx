"use client";

import React, {useState, useEffect} from "react";
import { Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import Drawer from "./Drawer";
import { useDrawerContext } from "@/context/DrawerContext";
import Link from "next/link";
import { useNavigation } from "@/utils/navigation";
import Auth from "./model/auth";
import Image from "next/image";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "USER" | "ADMIN"; 
}


const Navbar = () => {
  const { isOpen, openDrawer } = useDrawerContext();
  const { navigate } = useNavigation();
  const [user, setUser] = useState<User | null>(null);


  useEffect(()=>{
  const userData = JSON.parse(localStorage.getItem("user")?? "{}");
  // console.log(userData)
    if(userData){
      setUser(userData);
    }
  }, [])
  // console.log(user);
  
  return (
    // <header className="w-full ">
    //   <div className="container mx-auto px-4 ">
    //     <header className="sticky  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    //       <nav className="flex items-center justify-between">
    //         <Link
    //           href="/"
    //           className="lg:text-3xl text-2xl font-bold tracking-tight"
    //         >
    //           Bustify
    //         </Link>

    //         <div className="flex items-center gap-4">
    //           {user !== null ? (
    //             <div className="flex items-center gap-2">
    //               <Button
    //                 onClick={() => navigate("/tickets")}
    //                 variant="outline"
    //                 className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
    //               >
    //                 My Tickets
    //               </Button>
    //             </div>
    //           ) : (
    //             <Auth navigateRoute="/tickets" callback={[]} state={() => {}}>
    //               <Button
    //                 variant="outline"
    //                 className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6 text-md font-medium"
    //               >
    //                 My Tickets
    //               </Button>
    //             </Auth>
    //           )}

    //           <button
    //             onClick={openDrawer}
    //             //  variant="outline"
    //             className="py-5 px-3 rounded-full border-gray-500"
    //           >
    //             <Menu size={32} />
    //           </button>
    //         </div>
    //       </nav>
    //       {/* <MainNav /> */}
    //     </header>
    //   </div>
    //   {isOpen && <Drawer />}
    // </header>
    <header className="w-full ">
      <div className="container mx-auto px-4 ">
        <header className="sticky  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/logo.jpg"
                alt="Bustify Logo"
                className="lg:h-12 h-9 w-auto"
                width={20}
                height={20}
                unoptimized
              />
            </Link>

            <div className="flex items-center gap-4">
              {user !== null ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => navigate("/tickets")}
                    variant="outline"
                    className="sm:inline-flex rounded-3xl border-[#5157C1] py-5 px-6  lg:text-md text-sm w-24 lg:font-medium font-xs"
                  >
                    My Tickets
                  </Button>
                </div>
              ) : (
                <Auth navigateRoute="/tickets" callback={[]} state={() => {}}>
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
                className="py-5 px-3 rounded-full border-gray-500"
              >
                <Menu size={32} />
              </button>
            </div>
          </nav>
        </header>
      </div>
      {isOpen && <Drawer />}
    </header>
  );
};

export default Navbar;

