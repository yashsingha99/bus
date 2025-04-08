"use client";

import { Pencil, Plus, Search, MapPin, Calendar, Clock, Users, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useMemo } from "react";
import useScreenSize from "@/hooks/use-screen-size";
import { ITrip } from "@/model/trip.model";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { tripApi } from "@/API/trip.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Get the first trip for display
  const firstTrip = trip.Trips && trip.Trips.length > 0 ? trip.Trips[0] : null;
  
  // Format date for display
  const formattedDate = firstTrip?.date 
    ? new Date(firstTrip.date).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : 'No date set';
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'expiry': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status display text
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'expiry': return 'Expired';
      default: return status || 'Unknown';
    }
  };
  
  // Get the first timing for display
  const firstTiming = firstTrip?.Timing && firstTrip.Timing.length > 0 
    ? firstTrip.Timing[0] 
    : null;
  
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
          onClick={() => onEdit(trip._id || '')}
          className={`absolute top-2 right-2 rounded-full transition-all duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}
          size="icon"
          variant="secondary"
        >
          <Pencil className="h-4 w-4" />
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
          
          {firstTiming && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{firstTiming}</span>
            </div>
          )}
          
          {firstTrip?.SeatsLimit !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{firstTrip.SeatsLimit} seats</span>
            </div>
          )}
          
          {firstTrip?.price !== undefined && (
            <div className="text-lg font-semibold text-blue-600">
              ${firstTrip.price.toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onEdit(trip._id || '')}
        >
          Edit Trip
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TripManagementPage() {
  const isMobile = useScreenSize();
  const router = useRouter();
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleEditTrip = (tripId: string) => {
    router.push(`/admin/editTrip?tripId=${tripId}`);
  };
  
  const handleAddTrip = () => {
    router.push(`/admin/editTrip?tripId=newTrip`);
  };
  
  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tripApi.getAllTrips();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Failed to load trips. Please try again later.");
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
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={fetchTrips}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Trip Management</h1>
        <Button
          onClick={handleAddTrip}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Trip
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary" className="ml-1">{tripCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            Active
            <Badge variant="secondary" className="ml-1">{tripCounts.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            Upcoming
            <Badge variant="secondary" className="ml-1">{tripCounts.upcoming}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expiry" className="flex items-center gap-2">
            Expired
            <Badge variant="secondary" className="ml-1">{tripCounts.expiry}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? "No trips match your search criteria" 
              : "No trips available. Create your first trip to get started."}
          </p>
          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          ) : (
            <Button onClick={handleAddTrip}>
              <Plus className="h-4 w-4 mr-2" /> Add New Trip
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard 
              key={trip._id} 
              trip={trip} 
              onEdit={handleEditTrip} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
