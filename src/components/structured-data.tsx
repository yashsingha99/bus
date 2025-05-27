type StructuredDataType = 'BusTrip' | 'BusReservation';

interface BaseStructuredData {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

interface BusTripData extends BaseStructuredData {
  "@type": "BusTrip";
  name: string;
  departureTime: string;
  arrivalTime: string;
  departureBusStop: {
    "@type": "BusStop";
    name: string;
  };
  arrivalBusStop: {
    "@type": "BusStop";
    name: string;
  };
  provider: {
    "@type": "Organization";
    name: string;
  };
  price: number;
  priceCurrency: string;
}

interface BusReservationData extends BaseStructuredData {
  "@type": "Reservation";
  reservationNumber: string;
  reservationStatus: string;
  underName: {
    "@type": "Person";
    name: string;
  };
  reservationFor: {
    "@type": "BusTrip";
    name: string;
    departureTime: string;
    arrivalTime: string;
  };
  totalPrice: {
    "@type": "PriceSpecification";
    price: number;
    priceCurrency: string;
  };
}

interface StructuredDataProps {
  type: StructuredDataType;
  data: BusTripData | BusReservationData;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
} 