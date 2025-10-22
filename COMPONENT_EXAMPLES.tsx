/**
 * Component Usage Examples
 * 
 * Practical examples of using the component library
 * Copy and adapt these examples for your use cases
 */

import React, { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { Header, Footer, StationCard } from '@/components/organisms';
import { Card, CardBody, SearchBar, Alert } from '@/components/molecules';
import { Button, Input, Text, Badge, Spinner, Heading1, Heading2, BodyText } from '@/components/atoms';
import type { PetrolStation } from '@/types';

// ============================================================================
// Example 1: Complete Page Layout
// ============================================================================

export const ExamplePage = () => {
  return (
    <MainLayout
      header={{
        logoText: 'Petrol Finder',
        navItems: [
          { label: 'Home', href: '/', active: true },
          { label: 'Stations', href: '/stations' },
          { label: 'About', href: '/about' },
        ],
        actions: (
          <>
            <Button variant="ghost">Sign In</Button>
            <Button>Sign Up</Button>
          </>
        ),
        sticky: true,
        elevated: true,
      }}
      footer={{
        sections: [
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ],
          },
        ],
        copyright: '© {year} Petrol Finder. All rights reserved.',
      }}
      maxWidth="xl"
    >
      <Heading1>Find Petrol Stations</Heading1>
      <BodyText>Search and compare fuel prices in your area.</BodyText>
      
      {/* Page content goes here */}
    </MainLayout>
  );
};

// ============================================================================
// Example 2: Search Interface
// ============================================================================

export const SearchInterface = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PetrolStation[]>([]);

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      // API call here
      const data = await fetchStations(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Heading2>Search Stations</Heading2>
      
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        loading={isSearching}
        placeholder="Search by location, brand, or fuel type..."
        size="lg"
      />

      {isSearching && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner size="lg" />
          <Text color="secondary">Searching stations...</Text>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {results.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onViewDetails={() => console.log('View', station.id)}
              onGetDirections={() => console.log('Directions', station.id)}
            />
          ))}
        </div>
      )}

      {!isSearching && query && results.length === 0 && (
        <Alert variant="info">
          No stations found for "{query}". Try a different search term.
        </Alert>
      )}
    </div>
  );
};

// ============================================================================
// Example 3: Form with Validation
// ============================================================================

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // API call here
      await submitForm(formData);
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card elevation="md" padding="lg">
      <CardBody>
        <Heading2>Contact Us</Heading2>
        
        {showSuccess && (
          <Alert
            variant="success"
            title="Message Sent!"
            onClose={() => setShowSuccess(false)}
          >
            Thank you for contacting us. We'll respond within 24 hours.
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            errorMessage={errors.name}
            required
            fullWidth
            placeholder="Your name"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            errorMessage={errors.email}
            required
            fullWidth
            placeholder="your@email.com"
          />

          <Input
            label="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            error={!!errors.message}
            errorMessage={errors.message}
            required
            fullWidth
            placeholder="Your message"
          />

          {errors.submit && (
            <Alert variant="error">{errors.submit}</Alert>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            Send Message
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

// ============================================================================
// Example 4: Station List with Filters
// ============================================================================

export const StationList = () => {
  const [stations, setStations] = useState<PetrolStation[]>([]);
  const [filters, setFilters] = useState({
    fuelType: 'all',
    distance: 10,
    sortBy: 'distance',
  });
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadStations();
  }, [filters]);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStations(filters);
      setStations(data);
    } catch (error) {
      console.error('Failed to load stations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Heading1>Nearby Stations</Heading1>
          <BodyText color="secondary">
            Found {stations.length} stations within {filters.distance} km
          </BodyText>
        </div>
        
        <Badge variant="primary" size="lg">
          {filters.fuelType === 'all' ? 'All Fuels' : filters.fuelType}
        </Badge>
      </div>

      {/* Filters */}
      <Card padding="md" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant={filters.fuelType === 'all' ? 'solid' : 'outlined'}
            onClick={() => setFilters({ ...filters, fuelType: 'all' })}
          >
            All Fuels
          </Button>
          <Button
            variant={filters.fuelType === 'unleaded' ? 'solid' : 'outlined'}
            onClick={() => setFilters({ ...filters, fuelType: 'unleaded' })}
          >
            Unleaded
          </Button>
          <Button
            variant={filters.fuelType === 'diesel' ? 'solid' : 'outlined'}
            onClick={() => setFilters({ ...filters, fuelType: 'diesel' })}
          >
            Diesel
          </Button>
        </div>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Spinner size="xl" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onViewDetails={() => console.log('View', station.id)}
              onGetDirections={() => console.log('Directions', station.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Example 5: Dashboard Cards
// ============================================================================

export const Dashboard = () => {
  const stats = {
    totalStations: 1245,
    averagePrice: 1.89,
    cheapestToday: 1.65,
    trend: 'decreasing',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Heading1>Dashboard</Heading1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Stat Card 1 */}
        <Card elevation="md" padding="lg">
          <CardBody>
            <BodyText color="secondary">Total Stations</BodyText>
            <Heading2>{stats.totalStations.toLocaleString()}</Heading2>
            <Badge variant="info" size="sm">Active</Badge>
          </CardBody>
        </Card>

        {/* Stat Card 2 */}
        <Card elevation="md" padding="lg">
          <CardBody>
            <BodyText color="secondary">Average Price</BodyText>
            <Heading2>${stats.averagePrice.toFixed(2)}</Heading2>
            <Badge variant="neutral" size="sm">Per Liter</Badge>
          </CardBody>
        </Card>

        {/* Stat Card 3 */}
        <Card elevation="md" padding="lg">
          <CardBody>
            <BodyText color="secondary">Cheapest Today</BodyText>
            <Heading2 style={{ color: '#4CAF50' }}>
              ${stats.cheapestToday.toFixed(2)}
            </Heading2>
            <Badge variant="success" size="sm" dot>
              {stats.trend}
            </Badge>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card elevation="sm" style={{ marginTop: '2rem' }}>
        <CardBody>
          <Heading2>Recent Updates</Heading2>
          <Alert variant="info" style={{ marginTop: '1rem' }}>
            5 new stations added in your area this week
          </Alert>
        </CardBody>
      </Card>
    </div>
  );
};

// ============================================================================
// Helper Functions (for examples)
// ============================================================================

async function fetchStations(query: any): Promise<PetrolStation[]> {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
}

async function submitForm(data: any): Promise<void> {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

