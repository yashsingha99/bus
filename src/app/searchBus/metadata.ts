import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Bus Tickets | Bustify - Compare Prices with Abhibus, Redbus',
  description: 'Search and compare bus ticket prices across multiple platforms. Find the best deals on bus tickets, compare with Abhibus, Redbus, and other providers. Fast and easy bus booking.',
  openGraph: {
    title: 'Search Bus Tickets | Bustify - Compare Prices with Abhibus, Redbus',
    description: 'Search and compare bus ticket prices across multiple platforms. Find the best deals on bus tickets, compare with Abhibus, Redbus, and other providers. Fast and easy bus booking.',
    images: [
      {
        url: '/search-bus-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Search Bus Tickets on Bustify',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Bus Tickets | Bustify - Compare Prices with Abhibus, Redbus',
    description: 'Search and compare bus ticket prices across multiple platforms. Find the best deals on bus tickets, compare with Abhibus, Redbus, and other providers. Fast and easy bus booking.',
    images: ['/search-bus-twitter.jpg'],
  },
}; 