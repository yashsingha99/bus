"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchCard from "@/components/search-card";

export default function DesktopHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://sa.adanione.com/-/media/Project/Campaigns/Valentine-s-Day/Offers/IDBI-OFFER/BUS_IDBIRIDE/AdaniOne_Web_CategoryLandingPage_Bus_Flat50--6.jpg",
    "https://th.bing.com/th/id/OIP.4i0AkXXTgi84QEugP2DjxQHaEJ?rs=1&pid=ImgDetMain",
    "https://sa.adanione.com/-/media/Project/Campaigns/Valentine-s-Day/Offers/IDBI-OFFER/BUS_IDBIRIDE/AdaniOne_Web_CategoryLandingPage_Bus_Flat50--6.jpg",
    "https://img.freepik.com/premium-photo/3d-rendering-plane-flying-suitcases-map-boarding-pass-with-cloud-pink-background-travelling-abroad-vacation-concept_625883-895.jpg",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, images.length]);

  return (
    <>
      <motion.div
        // initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 6 }}
        viewport={{ once: true }}
        className="order-1 lg:order-2"
      >
        <div className="  w-full relative   -z-1 sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden shadow-xl">
          <div
            className="flex  h-full transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                className="flex-shrink-0 w-full h-full transition-opacity duration-1000"
              />
            ))}
          </div>

          {/* <DestSearchForm /> */}
          <SearchCard />

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}