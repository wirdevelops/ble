'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaList, FaMap } from 'react-icons/fa';
import TalentCard from '@/components/TalentCard';

interface Location {
  lat: number;
  lng: number;
}

interface TalentWithLocation {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  location: Location;
  distance: number; // in kilometers
  price: number;
  availability: string;
}

interface TalentMapProps {
  talents: TalentWithLocation[];
  userLocation?: Location;
  onLocationChange?: (location: Location) => void;
}

// Mock data - Replace with actual API data
const mockNearbyTalents: TalentWithLocation[] = [
  {
    id: '1',
    name: 'John Doe',
    category: 'Music',
    image: '/placeholder.jpg',
    rating: 4.8,
    reviews: 120,
    location: { lat: 5.9631, lng: 10.1591 }, // Bamenda coordinates
    distance: 0.5,
    price: 50,
    availability: 'Available Now',
  },
  {
    id: '2',
    name: 'Jane Smith',
    category: 'Dance',
    image: '/placeholder.jpg',
    rating: 4.7,
    reviews: 89,
    location: { lat: 5.9589, lng: 10.1456 },
    distance: 1.2,
    price: 75,
    availability: 'Available Tomorrow',
  },
  // Add more mock talents...
];

export default function TalentMap({ talents = mockNearbyTalents, userLocation, onLocationChange }: TalentMapProps) {
  const [showMap, setShowMap] = useState(true);
  const [selectedTalent, setSelectedTalent] = useState<string | null>(null);

  // Mock function to get user's location
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onLocationChange?.(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="relative h-[70vh] bg-surface rounded-xl border border-border overflow-hidden">
      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-10 bg-background rounded-xl border border-border shadow-lg">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 px-4 py-2"
        >
          {showMap ? (
            <>
              <FaList className="w-4 h-4" />
              <span>List View</span>
            </>
          ) : (
            <>
              <FaMap className="w-4 h-4" />
              <span>Map View</span>
            </>
          )}
        </button>
      </div>

      {/* Map View */}
      {showMap ? (
        <div className="h-full">
          {/* Replace this div with actual map implementation */}
          <div className="h-full bg-surface flex items-center justify-center text-text/60">
            <p>Map Component (Replace with Google Maps or Mapbox implementation)</p>
          </div>

          {/* Talent Preview */}
          <AnimatePresence>
            {selectedTalent && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-background rounded-xl border border-border shadow-lg"
              >
                {talents
                  .filter((t) => t.id === selectedTalent)
                  .map((talent) => (
                    <div key={talent.id} className="p-4">
                      <TalentCard talent={talent} />
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* List View */
        <div className="h-full overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {talents.map((talent) => (
              <div key={talent.id} className="relative">
                <TalentCard talent={talent} />
                <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-sm border border-border">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-3 h-3 text-primary" />
                    <span>{talent.distance}km away</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
