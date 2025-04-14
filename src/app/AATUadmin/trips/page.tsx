"use client";

import { Pencil, Plus, Search, MapPin, Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useMemo } from "react";
import { ITrip } from "@/model/trip.model";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { User } from "@/types/user.type";
import Auth from "@/components/model/auth";

function TripCardSkeleton() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}

function TripCard({ trip, onEdit }: { trip: ITrip; onEdit: (id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const firstTrip = trip.Trips && trip.Trips.length > 0 ? trip.Trips[0] : null;
  const tripId = String(trip._id || '');
  
  const formattedDate = firstTrip?.date 
    ? new Date(firstTrip.date).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }) 
    : 'No date set';
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'expiry': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'expiry': return 'Expired';
      default: return status || 'Unknown';
    }
  };
  
  const formatTimings = (timings: string[]) => {
    if (!timings || timings.length === 0) return 'No timings set';
    return timings.join(', ');
  };
  
  return (
    <Card 
      className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
           
            <MapPin className="h-16 w-16 text-white opacity-80" />
        </div>
        <Button 
          onClick={() => onEdit(tripId)}
          className={`absolute top-2 right-2 rounded-full transition-all duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}
          size="icon"
          variant="secondary"
        >
          <Pencil className="h-4 w-4"/>
        </Button>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold truncate pr-2">
            {trip.destinationAddress}
          </CardTitle>
          {firstTrip?.Status && (
            <Badge className={getStatusColor(firstTrip.Status)}>
              {getStatusText(firstTrip.Status)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          {firstTrip?.Timing && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatTimings(firstTrip.Timing)}</span>
            </div>
          )}
          
          {firstTrip?.SeatsLimit !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{String(firstTrip.SeatsLimit)} seats</span>
            </div>
          )}
          
          {firstTrip?.price !== undefined && (
            <div className="text-lg font-semibold text-blue-600">
              ₹{firstTrip.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onEdit(tripId)}
        >
          Edit Trip
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TripManagementPage() {
  // const isMobile = useScreenSize();
  const router = useRouter();
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : null;
      if(userData?.role !== "IAMADMINROCK"){
        router.push("/");
      }
      setUser(userData);
    }
  }, [router]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleEditTrip = (tripId: string) => {
    router.push(`/AATUadmin/editTrip?tripId=${tripId}`);
  };
  
  const handleAddTrip = () => {
    router.push(`/AATUadmin/editTrip?tripId=newTrip`);
  };
  
  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tripApi.getAllTrips();
      //  console.log(data)
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      // Validate and clean the data
      const validTrips = data.filter(trip => {
        return trip && 
               trip._id && 
               trip.destinationAddress && 
               Array.isArray(trip.Trips) &&
               trip.Trips.length > 0;
      });
      
      if (validTrips.length === 0) {
        throw new Error('No valid trips found');
      }
      
      setTrips(validTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError(error instanceof Error ? error.message : "Failed to load trips. Please try again later.");
      toast.error("Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTrips();
  }, []);
  
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = trip.destinationAddress.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (activeTab !== "all") {
        const hasMatchingStatus = trip.Trips.some(t => 
          t.Status.toLowerCase() === activeTab.toLowerCase()
        );
        matchesStatus = hasMatchingStatus;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, activeTab]);
  
  const tripCounts = useMemo(() => {
    const counts = {
      all: trips.length,
      active: 0,
      upcoming: 0,
      expiry: 0
    };
    
    trips.forEach(trip => {
      trip.Trips.forEach(t => {
        const status = t.Status.toLowerCase();
        if (status === 'active') counts.active++;
        else if (status === 'upcoming') counts.upcoming++;
        else if (status === 'expiry') counts.expiry++;
      });
    });
    
    return counts;
  
  }, [trips]);

    if (user === null) {
      return (
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Please sign in to view your tickets
            </h1>

            <Auth
              navigateRoute=""
              callback={[
                () => {
                  window.location.reload();
                },
              ]}
              state={() => {}}
            >
              <Button>Sign In</Button>
            </Auth>
          </div>
        </div>
      );
    }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleAddTrip} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add New Trip
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (filteredTrips.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-full inline-block">
              <MapPin className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {searchQuery 
                ? "No matching trips found"
                : "Welcome to Trip Management"}
            </h2>
            <p className="text-gray-600 max-w-md">
              {searchQuery 
                ? "Try adjusting your search criteria to find what you're looking for."
                : "Start managing your trips by adding your first destination. It's easy to get started!"}
            </p>
          </div>
          <Button 
            onClick={handleAddTrip} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            {searchQuery ? "Clear Search" : "Add Your First Trip"}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/bus-title-log.png"
            alt="Bus Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-3xl font-bold">Trip Management</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full md:w-[300px]"
           
            />
          </div>
          <Button onClick={handleAddTrip} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add New Trip
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({tripCounts.all})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({tripCounts.active})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({tripCounts.upcoming})
          </TabsTrigger>
          <TabsTrigger value="expiry">
            Expired ({tripCounts.expiry})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrips.map((trip) => (
          <TripCard
            key={String(trip._id)}
            trip={trip}
            onEdit={handleEditTrip}
          />
        ))}
      </div>
    </div>
  );
}
