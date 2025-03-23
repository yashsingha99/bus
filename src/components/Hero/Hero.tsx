"use client";

import React, { useEffect, useState } from "react";
// import DestSearchForm from "./DestSearchForm";
import { motion } from "framer-motion";
import DestSearchForm from "./DestSearchForm";

function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const colors = ["#64783b", "#2563eb", "#ca8a04"]; // Fixed color values with proper hex codes

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIndex((currentIndex + 1) % colors.length);
        }, 5000);

        return () => clearTimeout(timer); 
    }, [currentIndex, colors.length]);  

    return (
        <div className="w-full">
            <motion.div
                // initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 4 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
            >

                <div className=" w-full relative   -z-1 sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden shadow-xl">
                    <div
                        className="flex  h-full transition-transform duration-1000 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >

                        {colors.map((color, index) => (
                            <div
                                key={index}
                                style={{ backgroundColor: color }} // Using inline style for dynamic colors
                                className="flex-shrink-0 w-full h-full transition-opacity duration-1000"
                            >
                                {/* Content for each slide can go here */}
                            </div>
                        ))}
                    </div>

                    <DestSearchForm />

                    {/* Navigation dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        {colors.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentIndex === index
                                        ? "bg-white scale-125 shadow-lg"
                                        : "bg-white/50 hover:bg-white/75"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Hero;