/**
 * FluidGrid Usage Examples
 * 
 * This file demonstrates how to use the FluidGrid component
 * with different configurations for station cards and other content.
 */

import React from 'react';
import { FluidGrid, GridItem, DefaultFluidGrid } from './FluidGrid';

// Example 1: Basic usage with station cards
export function StationCardsGridExample() {
  const stations = [
    // ... your station data
  ];

  return (
    <DefaultFluidGrid
      gap="md"
      animate={true}
      staggerDelay={0.05}
      uniformHeights={true}
    >
      {stations.map((station) => (
        <GridItem key={station.id}>
          <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
            {/* Station card content */}
            <h3 className="text-xl font-bold mb-2">{station.name}</h3>
            <p className="text-gray-600 mb-4">{station.address}</p>
            <div className="mt-auto">
              <span className="text-2xl font-bold text-primary-600">
                ${station.price}
              </span>
            </div>
          </div>
        </GridItem>
      ))}
    </DefaultFluidGrid>
  );
}

// Example 2: Custom columns with fluid gap spacing
export function CustomColumnsExample() {
  return (
    <FluidGrid
      columns={{
        base: 1,
        sm: 2,
        lg: 4,
        xl: 5,
      }}
      gap="lg"
      fluidGap={true}
      uniformHeights={true}
      animate={true}
    >
      {/* Grid items */}
    </FluidGrid>
  );
}

// Example 3: Static grid without animations
export function StaticGridExample() {
  return (
    <FluidGrid
      gap="sm"
      animate={false}
      uniformHeights={false}
    >
      {/* Grid items without animation */}
    </FluidGrid>
  );
}

// Example 4: Combining with existing StationCard component
export function StationCardsIntegrationExample() {
  const stations = [
    // ... your station data
  ];

  return (
    <DefaultFluidGrid
      gap="md"
      animate={true}
      staggerDelay={0.05}
      className="px-4 sm:px-6 lg:px-8"
    >
      {stations.map((station, index) => (
        <GridItem key={station.id}>
          <StationCard
            station={station}
            index={index}
            showTransition={true}
            transitionDelay={index * 0.05}
            className="h-full"
          />
        </GridItem>
      ))}
    </DefaultFluidGrid>
  );
}

// Mock components for example
const StationCard = ({ station, className, ...props }: any) => (
  <div className={className}>{/* Card content */}</div>
);

