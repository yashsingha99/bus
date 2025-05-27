"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, LucideProps, Star } from "lucide-react";
import Footer from "@/components/footer";

const GoogleIcon = ({
  size = 24,
  // color = "currentColor",
  ...props
}: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    {...props}
  >
    <path
      fill="#4285F4"
      d="M24 9.5c3.6 0 6.2 1.5 7.6 2.7l5.6-5.6C33.6 3.4 29.2 1.5 24 1.5 14.8 1.5 6.9 7.7 3.4 16.1l6.6 5.1C11.8 14 17.4 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M46.1 24.5c0-1.7-.1-3.1-.4-4.5H24v8.5h12.4c-.5 3-2.1 5.6-4.6 7.4l7.3 5.6c4.2-3.8 6.6-9.5 6.6-17z"
    />
    <path
      fill="#FBBC05"
      d="M10 28.2c-1-2.9-1-6.1 0-9l-6.6-5.1C.8 18.6 0 21.2 0 24s.8 5.4 2.2 7.9L10 28.2z"
    />
    <path
      fill="#EA4335"
      d="M24 46.5c6.2 0 11.4-2 15.2-5.4l-7.3-5.6c-2 1.4-4.6 2.3-7.9 2.3-6.6 0-12.2-4.4-14.1-10.3l-6.6 5.1C6.9 40.3 14.8 46.5 24 46.5z"
    />
  </svg>
);

import img1 from "../../assest/img1.jpg";
import img3 from "../../assest/img3.jpg";
import Image from "next/image";
import Head from "next/head";
export default function Page() {
  // State for image carousel
  const [currentTeamSlide, setCurrentTeamSlide] = useState(0);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
  const [currentStorySlide, setCurrentStorySlide] = useState(0);
  // Refs for slider elements

  const teamSliderRef = useRef<HTMLDivElement | null>(null);
  const reviewSliderRef = useRef<HTMLDivElement | null>(null);
  const storySliderRef = useRef<HTMLDivElement | null>(null);
  //  const storyIntervalRef = useRef(null);
  // Mock team data
  const teamMembers = [
    { name: "TANISH HRK", position: "Co-Founder" },
    { name: "YASH SINGHAL", position: "Technical Partner" },
    { name: "TARUN VARSHNEY", position: "Co-Founder" },
  ];

  const storyImages = [
    {
      src: img1,
      caption: "Our headquarters in downtown",
    },
    {
      src: img3,
      caption: "The talented team behind Bustify",
    },
    // {
    //   src: "/api/placeholder/600/400?text=Customer+Service",
    //   caption: "Dedicated customer support 24/7",
    // },
    // {
    //   src: "/api/placeholder/600/400?text=Bus+Partners",
    //   caption: "Partnering with top bus operators",
    // },
  ];

  const navigateSlider = (direction: string) => {
    if (direction === "next") {
      setCurrentStorySlide((prev) => (prev + 1) % storyImages.length);
    } else {
      setCurrentStorySlide(
        (prev) => (prev - 1 + storyImages.length) % storyImages.length
      );
    }
  };
  // Mock review data
  const reviews = useMemo(
    () => [
      {
        name: "Harshita Lavania",
        rating: 5,
        text: "Great experience with bustify, timely service, convenient bus timings, good quality for the price.",
      },
      {
        name: "Nikhil Bansal",
        rating: 5,
        text: "bus service and quality so good! The booking process was seamless",
      },
      {
        name: "Saksham Agrawal",
        rating: 4,
        text: "Great service overall. The interface is intuitive and I found exactly what I needed without any hassle.",
      },
      {
        name: "Saloni Bansal",
        rating: 5,
        text: "I've been using Bustify for all my bus travel needs for the past year. Never disappoints!",
      },
    ],
    []
  );

  const navigateTeamSlider = (direction: string) => {
    const container = teamSliderRef.current;
    if (!container) return;

    const firstItem = container.querySelector("div");
    if (!firstItem) return;

    const itemWidth = (firstItem as HTMLDivElement).offsetWidth;
    const visibleItems = Math.floor(container.offsetWidth / itemWidth);
    const maxSlides = Math.ceil(teamMembers.length / visibleItems) - 1;

    if (direction === "next" && currentTeamSlide < maxSlides) {
      setCurrentTeamSlide((prev) => prev + 1);
    } else if (direction === "prev" && currentTeamSlide > 0) {
      setCurrentTeamSlide((prev) => prev - 1);
    }
  };
  const navigateReviewSlider = (direction: string) => {
    const maxSlides = reviews.length - 1;

    if (direction === "next" && currentReviewSlide < maxSlides) {
      setCurrentReviewSlide((prev) => prev + 1);
    } else if (direction === "prev" && currentReviewSlide > 0) {
      setCurrentReviewSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewSlide((prev) =>
        prev === reviews.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

  return (
    <>
      <Head>
        <title>About | Bustify</title>
        <meta
          name="description"
          content="Bustify was founded in 2024 with a focused mission: to provide affordable and reliable bus services for college students appearing for NPTEL exams. What began as a student initiative to solve a real transportation challenge has grown into a trusted service.

In the past year, Bustify successfully arranged comfortable and cost-effective travel for over 500 students. the platform ensured smooth, timely, and budget-friendly travel experiences."
        />
        <meta property="og:title" content="About | Bustify" />
        <meta property="og:description" content="About page of Bustify" />
        <meta property="og:image" content="/preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://bustify.in/about" />
      </Head>
      <main className="flex-1 overflow-hidden">
        <section className="relative w-full py-8 md:py-16 lg:py-24 bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-white/20 z-0"></div>

          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
                  About Bustify
                </h1>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground">
                  Your trusted partner for convenient and reliable bus travel
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4 order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Our Story
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Bustify was founded in 2024 with a focused mission: to provide
                  affordable and reliable bus services for college students
                  appearing for NPTEL exams. What began as a student initiative
                  to solve a real transportation challenge has grown into a
                  trusted service.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground">
                  In the past year, Bustify successfully arranged comfortable
                  and cost-effective travel for over 500 students. the platform
                  ensured smooth, timely, and budget-friendly travel
                  experiences.
                </p>
              </div>

              <div
                className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg order-1 lg:order-2"
                ref={storySliderRef}
              >
                {/* Story Images Slider */}
                <div className="relative w-full h-full">
                  {storyImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 w-full h-full transition-all duration-700 transform ${
                        index === currentStorySlide
                          ? "opacity-100 translate-x-0"
                          : index < currentStorySlide
                            ? "opacity-0 -translate-x-full"
                            : "opacity-0 translate-x-full"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={`Bustify story image ${index + 1}`}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                      {/* Caption overlay */}
                      {/* <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm md:text-base">
                        {image.caption}
                      </p>
                    </div> */}
                    </div>
                  ))}

                  {/* Story navigation buttons */}
                  <button
                    onClick={() => navigateSlider("prev")}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity duration-300 focus:outline-none z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => navigateSlider("next")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity duration-300 focus:outline-none z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Story indicator dots */}
                  <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-2 z-10">
                    {storyImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStorySlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          currentStorySlide === index
                            ? "bg-white"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-24 bg-muted">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Our Mission & Values
                </h2>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                  What drives us every day
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Customer First",
                  desc: "We put our customers at the center of everything we do, constantly seeking ways to improve their experience.",
                },
                {
                  title: "Innovation",
                  desc: "We embrace technology and innovative solutions to solve complex problems in the transportation industry.",
                },
                {
                  title: "Reliability",
                  desc: "We strive to provide reliable service that our customers can count on, every single time.",
                },
                {
                  title: "Transparency",
                  desc: "We believe in being transparent with our customers about pricing, policies, and service details.",
                },
                {
                  title: "Accessibility",
                  desc: "We're committed to making bus travel accessible to everyone, regardless of location or background.",
                },
                {
                  title: "Sustainability",
                  desc: "We promote bus travel as a more environmentally friendly alternative to individual transportation.",
                },
              ].map((value, i) => (
                <div
                  key={i}
                  className="bg-background p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Our Team
                </h2>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                  Meet the people behind Bustify
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden" ref={teamSliderRef}>
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentTeamSlide * 100}%)`,
                  }}
                >
                  {teamMembers.map((member, i) => (
                    <div
                      key={i}
                      className="flex-none w-full sm:w-1/2 md:w-1/3 px-2"
                    >
                      <div className="flex flex-col items-center text-center p-4 h-full">
                        {/* <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <img
                          src={`/api/placeholder/128/128`}
                          alt={member.name}
                          className="object-cover w-full h-full"
                        />
                      </div> */}
                        <h3 className="text-lg sm:text-xl font-bold">
                          {member.name}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {member.position}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigateTeamSlider("prev")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md opacity-80 hover:opacity-100 focus:outline-none"
                disabled={currentTeamSlide === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={() => navigateTeamSlider("next")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md opacity-80 hover:opacity-100 focus:outline-none"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(teamMembers.length / 3) }).map(
                (_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full ${currentTeamSlide === i ? "bg-primary" : "bg-gray-300"}`}
                    onClick={() => setCurrentTeamSlide(i)}
                  />
                )
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-24 bg-muted">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  What Our Customers Say
                </h2>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                  Real reviews from Bustify users
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="overflow-hidden rounded-lg bg-background shadow-lg"
                ref={reviewSliderRef}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentReviewSlide * 100}%)`,
                  }}
                >
                  {reviews.map((review, i) => (
                    <div key={i} className="flex-none w-full p-6 md:p-8">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between">
                          <div className="flex mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <GoogleIcon className="w-5 h-5" />
                        </div>

                        <p className="text-base sm:text-lg italic mb-4">
                          {review.text}
                        </p>
                        <p className="text-sm sm:text-base font-semibold mt-auto">
                          — {review.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigateReviewSlider("prev")}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md opacity-80 hover:opacity-100 focus:outline-none"
                disabled={currentReviewSlide === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={() => navigateReviewSlider("next")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md opacity-80 hover:opacity-100 focus:outline-none"
                disabled={currentReviewSlide === reviews.length - 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full ${currentReviewSlide === i ? "bg-primary" : "bg-gray-300"}`}
                  onClick={() => setCurrentReviewSlide(i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Ready to Experience Bustify?
                </h2>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                  Join thousands of satisfied travelers who have chosen Bustify
                  for their journey
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/searchBus">
                  <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
                    Book Your Journey
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 sm:px-8 w-full sm:w-auto"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
