'use client';

import { useState } from 'react';
import { BiSearch, BiFilter, BiCalendarAlt, BiListUl } from 'react-icons/bi';
import EventCard from '@/components/events/EventCard';
import EventCalendar from '@/components/events/EventCalendar';
import EventFilters from '@/components/events/EventFilters';
import withAuth from '@/components/auth/withAuth';
import { PermissionGate } from '@/components/auth/withPermission';
import { Permissions } from '@/lib/auth/roles';
import { usePermissions } from '@/hooks/usePermissions';
import { motion } from 'framer-motion';
import { BiCalendarEvent, BiMapPin, BiTicket, BiSlider, BiHeart, BiVideo, BiStats } from 'react-icons/bi';
import { FaStream, FaChalkboardTeacher, FaNetworkWired, FaTrophy, FaUsers } from 'react-icons/fa';
import FeaturedEvent from '@/components/events/FeaturedEvent';
import EventCategories from '@/components/events/EventCategories';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import EventGamification from '@/components/events/EventGamification';
import LiveEngagement from '@/components/events/LiveEngagement';
import VenueExplorer from '@/components/events/VenueExplorer';
import EventAnalytics from '@/components/events/EventAnalytics';
import VirtualEventHub from '@/components/events/VirtualEventHub';

const eventTypes = [
  { id: 'performance', name: 'Performances', icon: FaStream },
  { id: 'workshop', name: 'Workshops', icon: FaChalkboardTeacher },
  { id: 'networking', name: 'Networking', icon: FaNetworkWired },
  { id: 'competition', name: 'Competitions', icon: FaTrophy },
  { id: 'community', name: 'Community', icon: FaUsers },
];

const mockFeaturedEvent = {
  id: '1',
  title: 'Bamenda Music Festival 2024',
  description: 'The biggest music festival in Bamenda featuring top local and international artists.',
  date: '2024-03-15',
  time: '16:00',
  location: 'Commercial Avenue, Bamenda',
  image: '/images/events/images.jpg',
  type: 'hybrid',
  virtualAccess: {
    streamingUrl: 'https://stream.example.com/bda-music-fest',
    recordingAvailable: true,
    hasQandA: true,
  },
  price: {
    regular: 5000,
    vip: 15000,
    virtual: 2000,
  },
  organizer: {
    name: 'Black Legendary Empire',
  },
  categories: ['Music', 'Festival', 'Cultural'],
  attendees: {
    inPerson: 1200,
    virtual: 500,
    capacity: {
      inPerson: 2000,
      virtual: 1000,
    }
  },
  engagement: {
    likes: 450,
    shares: 230,
    comments: 180,
    rsvps: 1500,
  },
  analytics: {
    ticketsSold: 850,
    revenue: 4250000,
    engagementRate: 78,
    satisfactionScore: 4.5,
  },
  venue: {
    name: 'Commercial Avenue',
    address: 'Bamenda, Cameroon',
    coordinates: { lat: 5.9631, lng: 10.1591 },
    capacity: 5000,
    amenities: ['Parking', 'Food Court', 'Restrooms', 'First Aid'],
  }
};

function EventsPage() {
  const { can } = usePermissions();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [eventFormat, setEventFormat] = useState<'all' | 'inPerson' | 'virtual' | 'hybrid'>('all');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface p-4 md:p-6 border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Events</h1>
            
            <PermissionGate 
              permissions={[Permissions.CREATE_EVENT, Permissions.MANAGE_EVENTS]}
              fallback={null}
            >
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => {/* Handle create event */}}
              >
                Create Event
              </button>
            </PermissionGate>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg"
              />
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-surface-dark rounded-lg hover:bg-surface-dark/90"
              >
                <BiFilter />
                Filters
              </button>

              <PermissionGate permissions={Permissions.MANAGE_EVENTS}>
                <button
                  onClick={() => {/* Handle manage events */}}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-dark rounded-lg hover:bg-surface-dark/90"
                >
                  Manage Events
                </button>
              </PermissionGate>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        {/* View Mode Toggle */}
        <div className="flex justify-end mb-4">
          <div className="bg-surface-dark rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={\`px-3 py-1 rounded-md \${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }\`}
            >
              <BiListUl className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={\`px-3 py-1 rounded-md \${
                viewMode === 'calendar'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }\`}
            >
              <BiCalendarAlt className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Events Grid/Calendar */}
        {viewMode === 'list' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Event cards */}
            <FeaturedEvent event={mockFeaturedEvent} />
            <EventCategories eventTypes={eventTypes} />
            <UpcomingEvents />
            <EventGamification event={mockFeaturedEvent} />
            <LiveEngagement event={mockFeaturedEvent} />
            <VenueExplorer event={mockFeaturedEvent} />
            <EventAnalytics event={mockFeaturedEvent} />
            <VirtualEventHub event={mockFeaturedEvent} />
          </motion.div>
        ) : (
          <EventCalendar events={[mockFeaturedEvent]} />
        )}
      </div>

      {/* Filters Modal */}
      <EventFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(filters) => {
          // Handle filter application
          setShowFilters(false);
        }}
      />
    </div>
  );
}

// Wrap with authentication and basic permissions
export default withAuth(EventsPage, { requireAuth: true, requireOnboarding: true });
