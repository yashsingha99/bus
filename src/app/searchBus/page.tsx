"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  Plus,
  Star,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  applyPromoCode,
  formatPrice,
  getPriceFromTripData,
} from "@/utils/priceUtils";
import { createOrderId } from "@/API/orderId";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import Razorpay from "razorpay";
import { bookingApi } from "@/API/booking.api";
import { toast, Toaster } from "sonner";
import LoadingSkeleton from "./_components/loading-skeleton";
import PaymentDrawer from "./_components/paymentDrawer";
// Mock data for buses
const buses = [
  {
    id: "67dfe03f07d8257824cf8792",
    name: "Express Deluxe",
    company: "Royal Travels",
    from: "New York",
    to: "Boston",
    departureTime: "08:00 AM",
    arrivalTime: "12:30 PM",
    duration: "4h 30m",
    price: 45.99,
    availableSeats: 24,
    totalSeats: 36,
    rating: 4.5,
    amenities: ["AC", "WiFi", "USB Charging", "Snacks"],
    busType: "Luxury",
    driver: {
      name: "Michael Johnson",
      phone: "+1 (555) 123-4567",
      experience: "8 years",
    },
    conductor: {
      name: "Robert Smith",
      phone: "+1 (555) 987-6543",
    },
    offers: [
      {
        id: "offer1",
        title: "Group Discount",
        description: "Book 4 or more seats and get 10% off",
        code: "GROUP10",
      },
    ],
  },
  {
    id: "2",
    name: "Night Rider",
    company: "City Express",
    from: "New York",
    to: "Boston",
    departureTime: "10:00 PM",
    arrivalTime: "02:30 AM",
    duration: "4h 30m",
    price: 39.99,
    availableSeats: 18,
    totalSeats: 36,
    rating: 4.2,
    amenities: ["AC", "WiFi", "USB Charging"],
    busType: "Standard",
    driver: {
      name: "David Wilson",
      phone: "+1 (555) 234-5678",
      experience: "5 years",
    },
    conductor: {
      name: "Thomas Brown",
      phone: "+1 (555) 876-5432",
    },
    offers: [],
  },
];

export default function BusDetailsPage() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup");
  const tripId = searchParams.get("destination") as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [openPassenger, setOpenPassenger] = useState(-1);
  const [selectedPassenger, setSelectedPassenger] = useState([1]);
  const [passengerDetails, setPassengerDetails] = useState([
    { name: "", phone: "", gender: "" },
  ]);
  const [error, setError] = useState([
    { name: false, phone: false, gender: false },
  ]);
  const [errorDateTime, setErrorDateTime] = useState({
    date: false,
    time: false,
  });
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [tripData, setTripData] = useState<ITrip>();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [openManualPaymentDrawer, setOpenManualPaymentDrawer] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File>();
  const { user } = useUser();
  const userData = {
    fullName: user?.fullName,
    email: user?.primaryEmailAddress?.emailAddress,
    phoneNumber: user?.primaryPhoneNumber?.phoneNumber || "",
    clerkId: user?.id,
  };

  //--------------------------- URL -----------------------------
  const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  //--------------------------- HANDLE PAYMENT BY MANUAL -----------------------------
  const handlePaymentByManual = async () => {
    setIsLoading(true);
    try {
      let shouldAdd = isValidateInfo();
      let shouldProcced = isValidateDateTime();

      if (!shouldAdd || !shouldProcced || !paymentProof) {
        alert("Please fill all required fields correctly");
        setIsLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('file', paymentProof);
      
      const uploadResponse = await axios.post(`${URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!uploadResponse.data.url) {
        throw new Error("Failed to upload payment proof");
      }
      
      const paymentProofUrl = uploadResponse.data.url;
      
      // Now create the booking with the payment proof URL
      const bookingResponse = await axios.post(`${URL}/api/passanger/bookingManual`, {
        pickupAddress: pickup || "Default Pickup",
        bookedBy: userData.clerkId,
        destination: tripId,
        time: selectedTime,
        passengerDetails: passengerDetails,
        totalAmount: finalPrice,
        status: "pending",
        paymentStatus: "pending",
        paymentProof: paymentProofUrl,
      });

      const booking = bookingResponse.data.data;

      if (booking && booking._id) {
        toast("Booking Successful!", {
          description: "Your booking has been confirmed",
          action: {
            label: "View Booking",
            onClick: () =>
              router.push(`/booking-confirmation?bookingId=${booking._id}`),
          },
        });
        router.push(`/booking-confirmation?bookingId=${booking._id}`);
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast("Payment Failed!", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //--------------------------- HANDLE PAYMENT BY RAZORPAY -----------------------------
  const handlePaymentByRazorpay = async () => {
    setIsLoading(true);
    try {
      // Validate passenger details and date/time
      let shouldAdd = isValidateInfo();
      let shouldProcced = isValidateDateTime();

      if (!shouldAdd || !shouldProcced) {
        alert("Please fill all required fields correctly");
        setIsLoading(false);
        return;
      }

      // Format passenger details for the booking
      const formattedPassengerDetails = passengerDetails.map((passenger) => ({
        name: passenger.name,
        phone: passenger.phone,
        gender: passenger.gender.toLowerCase() as "male" | "female" | "other",
      }));

      // Create order ID for payment
      const orderId: string = await createOrderId(finalPrice, "INR");
      console.log("Order ID:", orderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: finalPrice * 100,
        currency: "INR",
        name: "Bus Booking System",
        description: `Booking for ${tripData?.destinationAddress || "Destination"}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const paymentResponse = await axios.post(`${URL}/api/verifyOrder`, {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log("Payment Response:", paymentResponse, "response", response);

            const bookingResponse = await axios.post(
              `${URL}/api/passanger/booking`,
              {
                pickupAddress: pickup || "Default Pickup",
                bookedBy: userData.clerkId,
                destination: tripId,
                time: selectedTime,
                passengerDetails: formattedPassengerDetails,
                totalAmount: finalPrice,
                status: "pending",
                paymentStatus: "pending",
                paymentId: response.razorpay_payment_id,
              }
            );

            const booking = bookingResponse.data.data;

            if (booking && booking._id) {
              await axios.put(`${URL}/api/passanger/booking/payment`, {
                bookingId: booking._id,
                paymentStatus: "completed",
              });

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
              // router.push(`/booking-confirmation?bookingId=${booking._id}`);
              console.log("Booking created:", booking);
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
          name: userData.fullName,
          email: userData.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
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

  //--------------------------- FETCH TRIP DATA -----------------------------
  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const res = await tripApi.getTripById(tripId);
      setTripData(res);
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      setTripData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  //--------------------------- FETCH TRIP DATA BY PAGE LOAD  -----------------------------
  useEffect(() => {
    fetchTrips();
  }, []);

  //------------- SET PRICE BY DATE AND TIME OF TRIP  -----------------------------
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

  //--------------------------- CALCULATE FINAL PRICE -----------------------------
  const finalPrice = useMemo(() => {
    return calculateTotalPrice(price, selectedPassenger.length, discount);
  }, [price, selectedPassenger.length, discount]);

  //--------------------------- APPLY PROMO CODE -----------------------------
  const handleApplyPromoCode = () => {
    if (!promoCode) {
      setPromoError("Please enter a promo code");
      return;
    }

    const newDiscount = applyPromoCode(promoCode, selectedPassenger.length);
    if (newDiscount > 0) {
      setDiscount(newDiscount);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  //--------------------------- HANDLE DROP DOWN -----------------------------
  const handleDropDown = (index: number) => {
    setOpenPassenger((prev) => (prev === index ? -1 : index));
  };

  //--------------------------- VALIDATE PASSENGER DETAILS -----------------------------
  const isValidateInfo = () => {
    const newError = passengerDetails.map(({ name, phone, gender }) => ({
      name: name === "",
      phone: phone.length !== 10,
      gender: gender === "",
    }));

    setError(newError);

    const shouldAdd = newError.every(
      (err) => !err.name && !err.phone && !err.gender
    );
    return shouldAdd;
  };

  //--------------------------- VALIDATE DATE AND TIME -----------------------------
  const isValidateDateTime = () => {
    let shouldProcced = true;
    const error = errorDateTime;
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

  //--------------------------- HANDLE ADD PASSENGER -----------------------------
  const handleAddPassenger = () => {
    let shouldAdd = isValidateInfo();

    if (shouldAdd) {
      setSelectedPassenger((prev) => [...prev, prev.length + 1]);
      setPassengerDetails((prev) => [
        ...prev,
        { name: "", phone: "", gender: "" },
      ]);
      setError((prev) => [
        ...prev,
        { name: false, phone: false, gender: false },
      ]);
    }
  };

  //--------------------------- UPDATE PASSENGER DETAILS -----------------------------
  const updatePassengerDetail = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPassengerDetails(updatedDetails);
  };

  //--------------------------- HANDLE REMOVE PASSENGER -----------------------------
  const handleRemovePassenger = (index: number) => {
    if (passengerDetails.length > 1) {
      const newSelectedPassenger = [...selectedPassenger];
      newSelectedPassenger.pop();
      setSelectedPassenger(newSelectedPassenger);

      const newPassengerDetails = passengerDetails.filter(
        (_, idx) => idx !== index
      );
      setPassengerDetails(newPassengerDetails);

      const newError = error.filter((_, idx) => idx !== index);
      setError(newError);
    } else {
      alert("At least one passenger is required");
    }
  };

  //--------------------------- PROCEED TO PAYMENT -----------------------------
  const proceedToPayment = () => {
    let shouldAdd = isValidateInfo();
    let shouldProcced = isValidateDateTime();
    if (shouldAdd && shouldProcced) {
      // // payment gateway
      // router.push(
      //   `/payment?busId=${tripId}&seats=${selectedPassenger.join(",")}&amount=${finalPrice}`
      // );
      handlePaymentByRazorpay();
    }
  };

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
                The bus you're looking for doesn't exist
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
        <Link href="/search">
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
          <CardDescription>Select your preferred date and time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>GLA University to {tripData?.destinationAddress}</span>
              </div>
              <div className="flex flex-wrap gap-4">
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
                    onValueChange={setSelectedTime}
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
        <div className="space-y-6">
          {selectedPassenger.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Passenger Details</CardTitle>
                <CardDescription>
                  Enter details for each passenger
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Passenger Details</TabsTrigger>
                    <TabsTrigger value="bus-info">Bus Information</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 pt-4">
                    {selectedPassenger.map((pId, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div
                            className="w-[80%]"
                            onClick={() => handleDropDown(index)}
                          >
                            <h4 className="font-medium">
                              Passenger {index + 1}
                            </h4>
                          </div>
                          <div className="w-[15%]">
                            <FeedbackButton
                              onClick={() => handleRemovePassenger(index)}
                              className="bg-gray-50 hover:bg-gray-100 rounded-full"
                            >
                              <Trash2 color="red" />
                            </FeedbackButton>
                          </div>
                        </div>
                        <div
                          className={`grid gap-4 md:grid-cols-3 ${
                            openPassenger === index
                              ? "max-h-0 opacity-0"
                              : "opacity-100"
                          }`}
                        >
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`}>Full Name</Label>
                            <Input
                              id={`name-${index}`}
                              value={passengerDetails[index]?.name || ""}
                              onChange={(e) =>
                                updatePassengerDetail(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="John Doe"
                            />
                            {error[index]?.name && (
                              <p className="text-red-600 text-sm">
                                Full Name is Required
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`phone-${index}`}>
                              Phone Number
                            </Label>
                            <Input
                              id={`phone-${index}`}
                              value={passengerDetails[index]?.phone || ""}
                              onChange={(e) =>
                                updatePassengerDetail(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              placeholder="1234567890"
                            />
                            {error[index]?.phone && (
                              <p className="text-red-600 text-sm">
                                Phone Number must be 10 digits
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`gender-${index}`}>Gender</Label>
                            <select
                              id={`gender-${index}`}
                              value={passengerDetails[index]?.gender || ""}
                              onChange={(e) =>
                                updatePassengerDetail(
                                  index,
                                  "gender",
                                  e.target.value
                                )
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                            {error[index]?.gender && (
                              <p className="text-red-600 text-sm">
                                Gender is Required
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <FeedbackButton onClick={handleAddPassenger}>
                      Add Another Passenger
                    </FeedbackButton>
                  </TabsContent>
                  <TabsContent value="bus-info" className="space-y-4 pt-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="mb-4 font-medium">Bus Tracking</h4>
                      <div className="flex items-center justify-center rounded-lg bg-muted/30 p-6">
                        <div className="text-center">
                          <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
                          <p className="mt-2">
                            Live tracking will be available 2 hours before
                            departure
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            {selectedDate && selectedTime ? (
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Selected Passenger</h3>
                    {selectedPassenger.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedPassenger.map((seatId) => (
                          <span
                            key={seatId}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-sm"
                          >
                            {seatId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No seats selected
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span>{formatPrice(price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seats </span>
                      <span> {selectedPassenger.length}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>
                          -
                          {formatPrice(
                            (price * selectedPassenger.length * discount) / 100
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <p>First Select your Exam Date and Time</p>
              </CardContent>
            )}
            <CardFooter className="flex flex-col gap-2">
              <FeedbackButton
                className="w-full"
                onClick={
                  proceedToPayment
                }
                disabled={
                  selectedPassenger.length === 0 ||
                  selectedDate === "" ||
                  selectedTime === ""
                }
              >
                {selectedPassenger.length === 0
                  ? "Select Seats"
                  : "Proceed to Payment"}
              </FeedbackButton>
              <PaymentDrawer
                isDisabled={
                  selectedPassenger.length === 0 ||
                  selectedDate === "" ||
                  selectedTime === ""
                }
                handlePaymentByManual={handlePaymentByManual}
                setPaymentProof={setPaymentProof}
              />
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
