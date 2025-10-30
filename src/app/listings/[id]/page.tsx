/**
 * Sample Detailed Listing Page
 * 
 * Example implementation of the detailed listing page component
 * 
 * @module app/listings/[id]/page
 */

import { DetailedListingPage } from '@/components/pages/DetailedListingPage';

// Sample listing data
const sampleListing = {
  id: '1',
  title: 'Modern Family Home in Melbourne',
  subtitle: 'Spacious 4-bedroom house with stunning city views',
  description: 'This beautifully designed family home offers the perfect blend of modern luxury and comfortable living. Located in one of Melbourne\'s most sought-after neighborhoods, this property features an open-plan living area, gourmet kitchen, and private outdoor space. The home has been recently renovated with high-quality finishes throughout, including hardwood floors, stone benchtops, and premium appliances. With four generous bedrooms, three bathrooms, and multiple living areas, this home provides ample space for families of all sizes. The master suite includes a walk-in wardrobe and ensuite bathroom, while the remaining bedrooms share a family bathroom. The property also features a double garage, landscaped gardens, and a covered outdoor entertaining area perfect for year-round use.',
  heroImage: '/images/listings/hero-house.jpg',
  images: [
    '/images/listings/house-1.jpg',
    '/images/listings/house-2.jpg',
    '/images/listings/house-3.jpg',
    '/images/listings/house-4.jpg',
    '/images/listings/house-5.jpg',
  ],
  price: 1250000,
  currency: '$',
  location: {
    address: '123 Collins Street',
    city: 'Melbourne',
    state: 'VIC',
    country: 'Australia',
    coordinates: {
      lat: -37.8136,
      lng: 144.9631,
    },
  },
  features: [
    '4 Bedrooms',
    '3 Bathrooms',
    'Double Garage',
    'Open Plan Living',
    'Gourmet Kitchen',
    'Private Garden',
    'City Views',
    'Recently Renovated',
    'Hardwood Floors',
    'Stone Benchtops',
    'Premium Appliances',
    'Walk-in Wardrobe',
    'Covered Outdoor Area',
    'Landscaped Gardens',
  ],
  amenities: {
    'Air Conditioning': true,
    'Heating': true,
    'Dishwasher': true,
    'Washing Machine': true,
    'Dryer': true,
    'Pool': false,
    'Gym': false,
    'Balcony': true,
    'Garden': true,
    'Parking': true,
    'Security': true,
    'Elevator': false,
  },
  contact: {
    phone: '+61 3 1234 5678',
    email: 'contact@realestate.com.au',
    website: 'https://realestate.com.au',
  },
  rating: 4.8,
  reviewCount: 24,
  reviews: [
    {
      id: '1',
      author: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely stunning property! The views from the living room are breathtaking, and the kitchen is a chef\'s dream. The location is perfect with easy access to the city and great schools nearby.',
      date: '2024-01-15',
      avatar: '/images/avatars/sarah.jpg',
    },
    {
      id: '2',
      author: 'Michael Chen',
      rating: 5,
      comment: 'We fell in love with this house the moment we walked in. The open-plan design is perfect for our family, and the outdoor space is ideal for entertaining. Highly recommended!',
      date: '2024-01-10',
      avatar: '/images/avatars/michael.jpg',
    },
    {
      id: '3',
      author: 'Emma Williams',
      rating: 4,
      comment: 'Beautiful home with great potential. The renovation work is top quality, and the location is excellent. The only minor issue is the street noise, but it\'s manageable.',
      date: '2024-01-05',
      avatar: '/images/avatars/emma.jpg',
    },
    {
      id: '4',
      author: 'David Brown',
      rating: 5,
      comment: 'Exceptional property in a prime location. The attention to detail in the renovation is impressive, and the garden is beautifully maintained. Perfect for families.',
      date: '2023-12-28',
      avatar: '/images/avatars/david.jpg',
    },
    {
      id: '5',
      author: 'Lisa Anderson',
      rating: 4,
      comment: 'Great family home with plenty of space. The kitchen is fantastic for cooking, and the bedrooms are all well-sized. The location is convenient for work and school.',
      date: '2023-12-20',
      avatar: '/images/avatars/lisa.jpg',
    },
  ],
  availability: {
    status: 'available' as const,
    date: '2024-02-01',
  },
  specifications: {
    'Property Type': 'House',
    'Bedrooms': '4',
    'Bathrooms': '3',
    'Car Spaces': '2',
    'Land Size': '600 sqm',
    'Building Size': '280 sqm',
    'Year Built': '2015',
    'Last Renovated': '2023',
    'Council Rates': '$2,400/year',
    'Water Rates': '$1,200/year',
  },
  category: 'Residential',
  tags: ['Family Home', 'Modern', 'Renovated', 'City Views', 'Garden', 'Garage'],
};

export default function ListingDetailPage() {
  return <DetailedListingPage listing={sampleListing} />;
}
