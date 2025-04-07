"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Info,
  MapPin,
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
import { string } from "zod";
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
  const bus = buses.find((b) => b.id === tripId);
  const [openPassenger, setOpenPassenger] = useState(-1);
  const [selectedPassenger, setSelectedPassenger] = useState([1]);
  const [passengerDetails, setPassengerDetails] = useState([
    { name: "", Ph_no: "", gender: "" },
  ]);
  const [error, setError] = useState([
    { name: false, Ph_no: false, gender: false },
  ]);
  const [errorDateTime, setErrorDateTime] = useState({
    date: false,
    time: false,
  });
  const [price, setPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [examDate, setExamDate] = useState<string>("");
  const [examTiming, setExamTiming] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tripData, setTripData] = useState<ITrip>();
  
  const fetchTrips = async () => {
    try {
      const res = await tripApi.getTripById(tripId);
      setTripData(res);
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      setTripData(undefined);
    }
  };

  const updatePrice = () => {
    if (selectedPassenger.length > 1)
      setFinalPrice((selectedPassenger.length * Number(price) )- discount);
  };

  useEffect(() => {
    updatePrice();
  }, [selectedPassenger, tripData]);

  useEffect(() => {
    if (!tripData || !tripData.Trips || !examDate || !examTiming) return;

    const selectedDate = new Date(examDate).toISOString().split("T")[0];

    const serviceFees = tripData.Trips.map((trip) => {
      const tripDate = new Date(trip.date).toISOString().split("T")[0];
      if (tripDate === selectedDate && trip.Timing.includes(examTiming)) {
        return trip.price;
      }
    });

    setPrice(Number(serviceFees[0]));
    setFinalPrice(Number(Number(serviceFees[0]) - discount));
  }, [examDate, examTiming, tripData]);

  useEffect(() => {
    fetchTrips();
  }, []);

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

  const handleDropDown = (index: number) => {
    setOpenPassenger((prev) => (prev === index ? -1 : index));
  };

  const isValidateInfo = () => {
    const newError = passengerDetails.map(({ name, Ph_no, gender }) => ({
      name: name === "",
      Ph_no: Ph_no.length !== 10,
      gender: gender === "",
    }));

    setError(newError);

    const shouldAdd = newError.every(
      (err) => !err.name && !err.Ph_no && !err.gender
    );
    return shouldAdd;
  };

  const isValidateDateTime = () => {
    let shouldProcced = true;
    const error = errorDateTime;
    if (examDate === "") {
      error.date = true;
      shouldProcced = false;
    }
    if (examTiming === "") {
      error.time = true;
      shouldProcced = false;
    }
    setErrorDateTime(error);
    return shouldProcced;
  };

  const handleAddPassenger = () => {
    let shouldAdd = isValidateInfo();

    if (shouldAdd) {
      setSelectedPassenger((prev) => [...prev, prev.length + 1]);
      setPassengerDetails((prev) => [
        ...prev,
        { name: "", Ph_no: "", gender: "" },
      ]);
      setError((prev) => [
        ...prev,
        { name: false, Ph_no: false, gender: false },
      ]);
      updatePrice();
    }
  };

  const updatePassengerDetail = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPassengerDetails(updatedDetails);
  };

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
      updatePrice();

    } else {
      alert("At least one passenger is required");
    }
  };

  const applyPromoCode = () => {
    if (promoCode === "GROUP10" && selectedPassenger.length >= 4) {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
      alert("Invalid promo code or conditions not met");
    }
  };

  const proceedToPayment = () => {
    let shouldAdd = isValidateInfo();
    let shouldProcced = isValidateDateTime();
    if (shouldAdd && shouldProcced) {
      router.push(
        `/payment?busId=${tripId}&seats=${selectedPassenger.join(",")}&amount=${finalPrice}`
      );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Link href="/search">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          {/* <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">{bus.name}</CardTitle>
              <CardDescription>
                {bus.company} • {bus.busType}
              </CardDescription>
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-5 w-5 fill-primary text-primary" />
              <span className="text-lg font-medium">{bus.rating}</span>
            </div>
          </div> */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>GLA University to {tripData?.destinationAddress}</span>
              </div>
              <div className=" flex flex-wrap gap-4">
                <div className="w-[90%]">
                  <Select
                    defaultValue={examDate}
                    onValueChange={(value) => setExamDate(value)}
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
                  <br />
                  {errorDateTime.date && (
                    <p className="text-red-600 text-sm">
                      {" "}
                      Exam Date is Requied{" "}
                    </p>
                  )}
                </div>
                <div className="w-[90%]">
                  <Select
                    value={examTiming}
                    onValueChange={(value) => setExamTiming(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your exam Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Exam Date</SelectLabel>

                        {examDate && tripData?.Trips?.length ? (
                          tripData.Trips.map((trip: SingleTrip) => {
                            const tripDate = new Date(trip.date)
                              .toISOString()
                              .split("T")[0];
                            const selectedDate = new Date(examDate)
                              .toISOString()
                              .split("T")[0];

                            if (tripDate === selectedDate) {
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
                  <br />
                  {errorDateTime.time && (
                    <p className="text-red-600 text-sm">
                      {" "}
                      Exam Time is Requied{" "}
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
                          className={`grid gap-4 md:grid-cols-3 ${openPassenger === index ? "max-h-0 opacity-0" : "opacity-100"}`}
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
                            <Label htmlFor={`Ph_no-${index}`}>
                              Phone Number
                            </Label>
                            <Input
                              id={`Ph_no-${index}`}
                              value={passengerDetails[index]?.Ph_no || ""}
                              onChange={(e) =>
                                updatePassengerDetail(
                                  index,
                                  "Ph_no",
                                  e.target.value
                                )
                              }
                              placeholder="1234567890"
                            />
                            {error[index]?.Ph_no && (
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
                      Add Passenger
                    </FeedbackButton>
                  </TabsContent>
                  <TabsContent value="bus-info" className="space-y-4 pt-4">
                    {/* <div className="rounded-lg border p-4">
                      <h4 className="mb-4 font-medium">
                        Driver & Conductor Information
                      </h4>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Driver</span>
                          </div>
                          <div className="pl-7">
                            <div>{bus.driver.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {bus.driver.phone}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Experience: {bus.driver.experience}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Conductor</span>
                          </div>
                          <div className="pl-7">
                            <div>{bus.conductor.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {bus.conductor.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
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
            {examDate && examTiming ? (
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

                  {/* {bus.offers.length > 0 && (
                  <div>
                    <h3 className="font-medium">Available Offers</h3>
                    <div className="mt-1 space-y-2">
                      {bus.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="rounded-md border border-dashed border-primary/50 bg-primary/5 p-2 text-sm"
                        >
                          <div className="font-medium">{offer.title}</div>
                          <div className="text-muted-foreground">
                            {offer.description}
                          </div>
                          <div className="mt-1">
                            <span className="font-medium">Code:</span>{" "}
                            {offer.code}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                  {/* {selectedPassenger.length > 0 && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <FeedbackButton variant="outline" onClick={applyPromoCode}>
                      Apply
                    </FeedbackButton>
                  </div>
                )} */}

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span>₹{price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seats </span>
                      <span>X {selectedPassenger.length}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <p>First Select your Exam Date and Time</p>
              </CardContent>
            )}
            <CardFooter>
              <FeedbackButton
                className="w-full"
                onClick={proceedToPayment}
                disabled={
                  selectedPassenger.length === 0 ||
                  examDate === "" ||
                  examTiming === ""
                }
              >
                {selectedPassenger.length === 0
                  ? "Select Seats"
                  : "Proceed to Payment"}
              </FeedbackButton>
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

{
  /* <Card>
            <CardHeader>
              <CardTitle>Select Seats</CardTitle>
              <CardDescription>Click on an available seat to select it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-md rounded-lg bg-muted/30 p-4">
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-md bg-muted px-8 py-2 text-center font-medium">Driver</div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {seats.map((seat) => (
                      <TooltipProvider key={seat.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`flex h-12 w-full items-center justify-center rounded-md ${
                                seat.isBooked
                                  ? "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
                                  : selectedPassanger.includes(seat.id)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background hover:bg-muted"
                              }`}
                              onClick={() => !seat.isBooked && toggleSeatSelection(seat.id)}
                              disabled={seat.isBooked}
                            >
                              {seat.number}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {seat.isBooked ? "Booked" : `Seat ${seat.number} - $${seat.price}`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm bg-background"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm bg-primary"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm bg-muted opacity-50"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */
}
