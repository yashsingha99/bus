/**
 * Calculate the total price based on base price, number of passengers, and discount
 */
export function calculateTotalPrice(
  basePrice: number,
  passengerCount: number,
  discountPercentage: number = 0
): number {
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
  // Group discount - 10% off for 4 or more passengers
  if (promoCode === "GROUP10" && passengerCount >= 4) {
    return 10;
  }
  
  // Add more promo codes here as needed
  
  return 0;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = "₹"): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Get price from trip data based on selected date and time
 */
export function getPriceFromTripData(
  tripData: any,
  selectedDate: string,
  selectedTime: string
): number {
  if (!tripData?.Trips || !selectedDate || !selectedTime) {
    return 0;
  }

  const selectedDateObj = new Date(selectedDate);
  const selectedDateStr = selectedDateObj.toISOString().split("T")[0];

  for (const trip of tripData.Trips) {
    const tripDate = new Date(trip.date).toISOString().split("T")[0];
    
    if (tripDate === selectedDateStr && trip.Timing.includes(selectedTime)) {
      return trip.price;
    }
  }

  return 0;
} 