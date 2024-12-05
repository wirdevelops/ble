import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCompass, FaParking, FaRestroom, FaUtensils, FaWheelchair } from 'react-icons/fa';
import type { Event } from '@/types/events';

interface VenueExplorerProps {
  event: Event;
}

interface Amenity {
  id: string;
  name: string;
  icon: any;
  description: string;
  location: string;
}

interface Hotspot {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  icon: any;
}

export default function VenueExplorer({ event }: VenueExplorerProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);

  const amenities: Amenity[] = [
    {
      id: 'parking',
      name: 'Parking Area',
      icon: FaParking,
      description: 'Secure parking with 24/7 surveillance',
      location: 'North side of venue'
    },
    {
      id: 'restrooms',
      name: 'Restrooms',
      icon: FaRestroom,
      description: 'Accessible restrooms on all floors',
      location: 'Multiple locations'
    },
    {
      id: 'food',
      name: 'Food Court',
      icon: FaUtensils,
      description: 'Various food and beverage options',
      location: 'Ground floor'
    },
    {
      id: 'accessibility',
      name: 'Wheelchair Access',
      icon: FaWheelchair,
      description: 'Ramps and elevators available',
      location: 'All entrances'
    }
  ];

  const hotspots: Hotspot[] = [
    {
      id: 'main_stage',
      title: 'Main Stage',
      description: 'Primary performance area with state-of-the-art sound system',
      x: 30,
      y: 40,
      icon: FaMapMarkerAlt
    },
    {
      id: 'entrance',
      title: 'Main Entrance',
      description: 'Primary entry point with security check',
      x: 70,
      y: 80,
      icon: FaCompass
    }
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Venue Map */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">Venue Explorer</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map((floor) => (
              <button
                key={floor}
                onClick={() => setCurrentFloor(floor)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentFloor === floor
                    ? 'bg-primary text-white'
                    : 'bg-background text-text/60 hover:bg-primary/10'
                }`}
              >
                Floor {floor}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative aspect-video bg-background rounded-lg overflow-hidden">
          {/* Placeholder for actual venue map */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-background/50" />

          {/* Interactive Hotspots */}
          {hotspots.map((hotspot) => (
            <motion.button
              key={hotspot.id}
              className="absolute"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onClick={() => setSelectedHotspot(hotspot)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <hotspot.icon className="w-4 h-4" />
              </div>
            </motion.button>
          ))}

          {/* Hotspot Info Popup */}
          <AnimatePresence>
            {selectedHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-surface border border-border rounded-lg p-4 shadow-lg max-w-sm"
              >
                <h4 className="font-medium text-text mb-1">{selectedHotspot.title}</h4>
                <p className="text-sm text-text/60">{selectedHotspot.description}</p>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute top-2 right-2 text-text/40 hover:text-text"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">Venue Amenities</h3>
          <button
            onClick={() => setShowAmenities(!showAmenities)}
            className="text-primary text-sm font-medium"
          >
            {showAmenities ? 'Show Less' : 'Show All'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenities.slice(0, showAmenities ? undefined : 2).map((amenity) => (
            <div
              key={amenity.id}
              className="p-4 rounded-lg bg-background hover:bg-primary/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <amenity.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-medium text-text mb-1">{amenity.name}</h4>
              <p className="text-sm text-text/60">{amenity.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="sticky bottom-4 left-0 right-0">
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-full p-2 max-w-xs mx-auto">
          <div className="flex justify-around">
            {amenities.map((amenity) => (
              <button
                key={amenity.id}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                title={amenity.name}
              >
                <amenity.icon className="w-5 h-5 text-primary" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
