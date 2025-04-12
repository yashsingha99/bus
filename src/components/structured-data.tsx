import { Metadata } from 'next';

interface StructuredDataProps {
  type: 'BusTrip' | 'BusReservation';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    if (type === 'BusTrip') {
      return {
        '@context': 'https://schema.org',
        '@type': 'BusTrip',
        name: data.name,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        departureBusStop: {
          '@type': 'BusStop',
          name: data.departureBusStop,
        },
        arrivalBusStop: {
          '@type': 'BusStop',
          name: data.arrivalBusStop,
        },
        provider: {
          '@type': 'Organization',
          name: 'BusHub',
        },
        price: data.price,
        priceCurrency: 'INR',
      };
    } else if (type === 'BusReservation') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Reservation',
        reservationNumber: data.reservationNumber,
        reservationStatus: data.status,
        underName: {
          '@type': 'Person',
          name: data.passengerName,
        },
        reservationFor: {
          '@type': 'BusTrip',
          name: data.tripName,
          departureTime: data.departureTime,
          arrivalTime: data.arrivalTime,
        },
        totalPrice: {
          '@type': 'PriceSpecification',
          price: data.totalPrice,
          priceCurrency: 'INR',
        },
      };
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  );
} 