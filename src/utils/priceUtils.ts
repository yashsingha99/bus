import { ITrip } from "../model/trip.model";

/**
 * Calculate the total price based on base price, number of passengers, and discount
 */
export function calculateTotalPrice(
  basePrice: number,
  passengerCount: number,
  discountPercentage: number = 0
): number {
  if (basePrice < 0 || passengerCount < 1 || discountPercentage < 0) {
    throw new Error("Invalid input parameters");
  }
  const subtotal = basePrice * passengerCount;
  const discountAmount = subtotal * (discountPercentage / 100);
  return subtotal - discountAmount;
}

/**
 * Apply promo code and return discount percentage
 */
export function applyPromoCode(
  promoCode: string,
  passengerCount: number
): number {
  if (!promoCode || passengerCount < 1) {
    return 0;
  }

  // Group discount - 10% off for 4 or more passengers
  if (promoCode.toUpperCase() === "GROUP10" && passengerCount >= 4) {
    return 10;
  }
  
  // Add more promo codes here as needed
  
  return 0;
}

export interface PriceData {
  price: number;
  currency: string;
}

export const formatPrice = (data: PriceData): string => {
  if (!data || typeof data.price !== 'number') {
    throw new Error("Invalid price data");
  }

  const { price, currency = 'USD' } = data;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${currency} ${price.toFixed(2)}`;
  }
};

/**
 * Get price from trip data based on selected date and time
 */
export function getPriceFromTripData(
  tripData: ITrip,
  selectedDate: string,
  selectedTime: string
): number {
  if (!tripData?.Trips || !Array.isArray(tripData.Trips)) {
    throw new Error("Invalid trip data");
  }

  if (!selectedDate || !selectedTime) {
    throw new Error("Date and time must be provided");
  }

  try {
    const selectedDateObj = new Date(selectedDate);
    if (isNaN(selectedDateObj.getTime())) {
      throw new Error("Invalid date format");
    }

    const selectedDateStr = selectedDateObj.toISOString().split("T")[0];

    const matchingTrip = tripData.Trips.find(trip => {
      const tripDate = new Date(trip.date).toISOString().split("T")[0];
      return tripDate === selectedDateStr && trip.Timing.includes(selectedTime);
    });

    return matchingTrip?.price ?? 0;
  } catch (error) {
    console.error('Error getting price from trip data:', error);
    return 0;
  }
} 