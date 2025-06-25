"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Info } from "lucide-react";
import { pickupLocations } from "@/components/search-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { ITrip, SingleTrip } from "@/model/trip.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

import {
  calculateTotalPrice,
  formatPrice,
  getPriceFromTripData,
} from "@/utils/priceUtils";
import { createOrderId } from "@/API/orderId";
import axios from "axios";
import Script from "next/script";
import { toast, Toaster } from "sonner";
import LoadingSkeleton from "../_components/loading-skeleton";


 
import Auth from "@/components/model/auth";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_signature: string;
  [key: string]: unknown;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, unknown>;
  };
}

interface RazorpayWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  on: (event: string, callback: (response: RazorpayError) => void) => void;
  open: () => void;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export default function BusDetailsPage() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup");
  const tripId = searchParams.get("destination") as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorDateTime, setErrorDateTime] = useState({
    date: false,
    time: false,
    pickUp: false,
  });
  const [price, setPrice] = useState(0);
  const [tripData, setTripData] = useState<ITrip>();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;
      setUser(userData);
    }
  }, []);

  const userData = {
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone || "",
    userId: user?.id,
  };

  const isPickUpLocationExist = pickup
    ? pickupLocations.includes(pickup)
    : false;

  //--------------------------------------- HANDLE PAYMENT BY MANUAL -----------------------------------
  // const handlePaymentByManual = async () => {
  //   setIsLoading(true);
  //   try {
  //     const shouldProcced = isValidateDateTime();

  //     if (!shouldProcced || !paymentProof) {
  //       alert("Please fill all required fields correctly");
  //       setIsLoading(false);
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("file", paymentProof);

  //     const uploadResponse = await axios.post(`/api/upload`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (!uploadResponse.data.url) {
  //       throw new Error("Failed to upload payment proof");
  //     }

  //     const paymentProofUrl = uploadResponse.data.url;
  //     const bookingResponse = await axios.post(`/api/passanger/bookingManual`, {
  //       pickupAddress: pickup || selectedPickup,
  //       bookedBy: user?.id,
  //       destination: tripId,
  //       time: selectedTime,
  //       totalAmount: finalPrice,
  //       status: "pending",
  //       paymentStatus: "pending",
  //       paymentProof: paymentProofUrl,
  //     });
  //     console.log(bookingResponse);
  //     const booking = bookingResponse.data.data;

  //     if (booking && booking._id) {
  //       toast("Booking Successful!", {
  //         description: "Your booking has been confirmed",
  //         action: {
  //           label: "View Booking",
  //           onClick: () =>
  //             router.push(`/booking-confirmation?bookingId=${booking._id}`),
  //         },
  //       });
  //       router.push(`/booking-confirmation?bookingId=${booking._id}`);
  //     } else {
  //       throw new Error("Failed to create booking");
  //     }
  //   } catch (error) {
  //     console.error("Error processing payment:", error);
  //     toast("Payment Failed!", {
  //       description: "Please try again or contact support.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //-------------------------------------- HANDLE PAYMENT BY RAZORPAY ----------------------------------
  
  
  const handlePaymentByRazorpay = async () => {
    setIsLoading(true);
    try {
      const shouldProcced = isValidateDateTime();
      if (!shouldProcced || !tripId) return;
      if (!user?.id) {
        toast("User not found", {
          action: {
            label: "Sign in",
            onClick: () => router.push(`/ticket`),
          },
        });
        console.log("user not found");
        return;
      }
      const orderId: string = await createOrderId(finalPrice, "INR", tripId);
    
      const newDiscription = 
        `Booking ${" "} for ${" "} ${tripData?.destinationAddress || "Destination"} at pickup:= ${pickup ? pickup : selectedPickup}, Date:= ${new Date(
          selectedDate
        ).toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })} timing:= ${selectedTime}`
      
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: finalPrice * 100,
        currency: "INR",
        name: "Bustify Ticket Booking",
        // description: `Booking ${" "} for ${" "} ${tripData?.destinationAddress || "Destination"} at pickup:=${pickup ? pickup : selectedTime}, timing:=${selectedTime}`,
        description: newDiscription,
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            await axios.post(`/api/verifyOrder`, {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // console.log(
            //   "Payment Response:",
            //   paymentResponse,
            //   "response",
            //   response
            // );

            const bookingResponse = await axios.post(`/api/passanger/booking`, {
              pickupAddress: pickup || selectedPickup,
              bookedBy: user?.id,
              destination: tripId,
              time: selectedTime,
              date: new Date(selectedDate).toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              totalAmount: finalPrice,
              status: "pending",
              paymentStatus: "pending",
              paymentId: response.razorpay_payment_id,
            });

            const booking = bookingResponse.data.data;

            if (booking && booking._id) {
              // await axios.put(`/api/passanger/booking/payment`, {
              //   bookingId: booking._id,
              //   paymentStatus: "completed",
              // });

              // const added = await axios.get("/api/saveToSheet");
              //  console.log(added);

              toast("Payment Successful!", {
                description: "Your booking has been confirmed",
                action: {
                  label: "Procced to checkout",
                  onClick: () =>
                    router.push(
                      `/booking-confirmation?bookingId=${booking._id}`
                    ),
                },
              });
              router.push(`/booking-confirmation?bookingId=${booking._id}`);
            } else {
              throw new Error("Failed to create booking");
            }
          } catch (error) {
            console.error("Error processing payment:", error);
            toast("Payment Failed!", {
              description: "Please contact support.",
            });
          }
        },
        prefill: {
          name: userData?.fullName || "john deo",
          email: userData?.email || "email@gmail.com",
          contact: userData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as unknown as RazorpayWindow).Razorpay(
        options
      );
      razorpay.on("payment.failed", function (response: RazorpayError) {
        alert("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
      });
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //-------------------------------------- FETCH TRIP DATA ----------------------------------------------
  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await tripApi.getTripById(tripId);

      const filteredTrips = {
        ...res,
        Trips: res.Trips.filter((t) => t.Status !== "Expiry"),
      } as ITrip;

      setTripData(filteredTrips);
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      setTripData(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  //------------------------------------- FETCH TRIP DATA BY PAGE LOAD  ---------------------------------
  useEffect(() => {
    if (tripId) {
      fetchTrips();
    }
  }, [tripId, fetchTrips]);

  //------------------------------------ SET PRICE BY DATE AND TIME OF TRIP  -----------------------------

  useEffect(() => {
    if (tripData && selectedDate && selectedTime) {
      const newPrice = getPriceFromTripData(
        tripData,
        selectedDate,
        selectedTime
      );
      setPrice(newPrice);
    }
  }, [tripData, selectedDate, selectedTime]);

  //-------------------------------------- CALCULATE FINAL PRICE -------------------------------------
  const finalPrice = useMemo(() => {
    return calculateTotalPrice(price, 1, 0);
  }, [price]);

  const isValidateDateTime = () => {
    let shouldProcced = true;
    const error = errorDateTime;
    if (!pickup && selectedPickup === "") {
      error.pickUp = true;
      shouldProcced = false;
    }
    if (selectedDate === "") {
      error.date = true;
      shouldProcced = false;
    }
    if (selectedTime === "") {
      error.time = true;
      shouldProcced = false;
    }
    setErrorDateTime(error);
    return shouldProcced;
  };

  const handleUserData = useCallback((data: User | null) => {
    console.log("data", data);
    if (data) {
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
      });
      // handlePaymentByRazorpay();
    }
  }, []);

  const proceedToPayment = () => {
    const shouldProcced = isValidateDateTime();
    if (!user) {
      toast.error("Please sign in to proceed with payment");
      return;
    }
    if (shouldProcced) {
      handlePaymentByRazorpay();
    }
  };

  const handleTimeChange = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  //--------------------------- LOADING SKELETON -----------------------------
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  //--------------------------- BUS NOT FOUND -----------------------------
  if (!tripData) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Bus not found</h3>
              <p className="text-muted-foreground">
                The bus you are looking for does not exist
              </p>
              <Link href="/search">
                <Button className="mt-4">Back to Search</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  //--------------------------- RETURN JSX -----------------------------
  return (
    <div className="container mx-auto py-6">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="mb-6 flex items-center">
        <Link href="/searchBus">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>
      <Toaster />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Trip Details</CardTitle>
          <CardDescription>
            Select your preferred {!isPickUpLocationExist && "Pickup Location,"}{" "}
            date and time
          </CardDescription>
          {!isPickUpLocationExist && (
            <CardDescription className="text-yellow-600 text-md">
              You are book for {tripData?.destinationAddress}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {isPickUpLocationExist && (
                <div className="flex items-center text-sm text-yellow-600 text-md">
                  <MapPin className="mr-2 h-4 w-4 " />
                  <span>
                    {pickup} to {tripData?.destinationAddress}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                {!isPickUpLocationExist && (
                  <div className="w-[90%]">
                    <Select
                      value={selectedPickup}
                      onValueChange={setSelectedPickup}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your PickUp Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>PickUp Location</SelectLabel>
                          {pickupLocations?.length ? (
                            pickupLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No date available
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errorDateTime.date && (
                      <p className="text-red-600 text-sm">
                        PickUp Location is Required
                      </p>
                    )}
                    {errorDateTime.pickUp && (
                      <p className="text-red-600 text-sm">
                        PickUp Location is Required
                      </p>
                    )}
                  </div>
                )}
                <div className="w-[90%]">
                  <Select
                    value={selectedDate}
                    onValueChange={setSelectedDate}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your exam Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Exam Date</SelectLabel>
                        {tripData?.Trips?.length ? (
                          tripData.Trips.map((trip: SingleTrip) => (
                            <SelectItem
                              key={trip._id}
                              value={trip.date.toString()}
                            >
                              {new Date(trip.date).toLocaleString("en-IN", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No date available
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errorDateTime.date && (
                    <p className="text-red-600 text-sm">
                      Exam Date is Required
                    </p>
                  )}
                </div>
                <div className="w-[90%]">
                  <Select
                    value={selectedTime}
                    onValueChange={handleTimeChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your exam Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Exam Time</SelectLabel>
                        {selectedDate && tripData?.Trips?.length ? (
                          tripData.Trips.map((trip: SingleTrip) => {
                            const tripDate = new Date(trip.date)
                              .toISOString()
                              .split("T")[0];
                            const selectedDateStr = new Date(selectedDate)
                              .toISOString()
                              .split("T")[0];

                            if (tripDate === selectedDateStr) {
                              return trip.Timing.map((time, idx) => (
                                <SelectItem
                                  key={`${trip._id}-${idx}`}
                                  value={time}
                                >
                                  {time}
                                </SelectItem>
                              ));
                            }
                            return null;
                          })
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            Select Date First
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errorDateTime.time && (
                    <p className="text-red-600 text-sm">
                      Exam Time is Required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            {selectedDate && selectedTime ? (
              <CardContent>
                <div className="space-y-4">
                  <Separator />

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span>{formatPrice({ price, currency: "INR" })}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {formatPrice({ price: finalPrice, currency: "INR" })}
                    </span>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <p>
                  First Select your{" "}
                  {isPickUpLocationExist
                    ? "Exam Date and Time"
                    : "Exam Date, Time and Pickup Location"}{" "}
                </p>
              </CardContent>
            )}
            <CardFooter className="flex flex-col gap-2">
              {/* //------------------------------ RAZORPAY PAYMENT -----------------------------------*/}
              {user && user.id ? (
                <FeedbackButton
                  className="w-full"
                  onClick={proceedToPayment}
                  disabled={
                    selectedDate === "" ||
                    selectedTime === "" ||
                    (selectedPickup == "" && pickup === null)
                  }
                >
                  Proceed to Payment
                </FeedbackButton>
              ) : (
                <Auth
                  navigateRoute=""
                  callback={[() => {}]}
                  state={handleUserData}
                >
                  <FeedbackButton
                    className="w-full"
                    variant="default"
                    disabled={
                      selectedDate === "" ||
                      selectedTime === "" ||
                      (selectedPickup == "" && pickup === null)
                    }
                  >
                    Proceed to Payment
                  </FeedbackButton>
                </Auth>
              )}

              {/* //------------------------------ MANUAL PAYMENT -----------------------------------*/}

              {/* {user ? (
                <PaymentDrawer
                  amount={finalPrice}
                  isDisabled={
                    selectedDate === "" ||
                    selectedTime === "" ||
                    (selectedPickup == "" && pickup === null)
                  }
                  handlePaymentByManual={handlePaymentByManual}
                  setPaymentProof={setPaymentProof}
                />
              ) : (
                <Auth
                  navigateRoute=""
                  callback={[() => {}]}
                  state={() => {
                    // if (data) {
                    //   setUserDetails({
                    //     fullName: data.fullName,
                    //     email: data.email,
                    //     phone: data.phone,
                    //     userId: data._id,
                    //   });
                    // }
                  }}
                >
                  <FeedbackButton
                    className="w-full"
                    variant="default"
                    disabled={
                      selectedDate === "" ||
                      selectedTime === "" ||
                      (selectedPickup == "" && pickup === null)
                    }
                  >
                    Proceed to Payment Manual
                  </FeedbackButton>
                </Auth>
              )} */}
            </CardFooter>
          </Card>

          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Cancellation Policy</p>
                <p className="mt-1">
                  Free cancellation up to 24 hours before departure. A 50% fee
                  applies for cancellations made less than 24 hours before
                  departure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
