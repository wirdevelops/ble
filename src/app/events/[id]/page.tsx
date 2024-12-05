'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaHeart, FaRegHeart, FaShare, FaClock, FaUser, FaVolleyballBall } from 'react-icons/fa';
import type { Event } from '@/types/events';
import EventTimeline from '@/components/events/EventTimeline';
import ParticipationForm from '@/components/events/ParticipationForm';
import TicketSelection from '@/components/events/TicketSelection';
import EventGamification from '@/components/events/EventGamification';
import VenueExplorer from '@/components/events/VenueExplorer';
import LiveEngagement from '@/components/events/LiveEngagement';

// Mock data for the Reggae Festival
const mockEvent: Event = {
  id: '1',
  title: '3 Day Reggae Festival - 2nd Edition',
  description: 'Join us for the second edition of Bamenda\'s biggest reggae festival! Three days of music, culture, sports, and positive vibes.',
  startDate: '2024-03-15',
  endDate: '2024-03-17',
  location: {
    name: 'Old Town Mixico Field',
    address: 'Old Town, Bamenda',
    coordinates: {
      lat: 5.9631,
      lng: 10.1591
    }
  },
  type: 'offline',
  image: '/events/reggae-festival.jpg',
  bannerImage: '/events/reggae-festival-banner.jpg',
  organizer: {
    id: '1',
    name: 'Black Legendary Empire',
    image: '/ble-logo.png',
    description: 'Leading entertainment and cultural organization in Bamenda',
    social: {
      facebook: 'https://facebook.com/blacklegendaryempire',
      instagram: 'https://instagram.com/blacklegendaryempire'
    }
  },
  activities: [
    {
      id: '1',
      title: 'Football Tournament',
      description: 'Community football tournament with teams from different quarters',
      startDate: '2024-02-15',
      endDate: '2024-03-17',
      time: '14:00',
      location: 'Mixico Field',
      type: 'offline',
      status: 'ongoing',
      currentParticipants: 128,
      image: '/events/football.jpg'
    },
    {
      id: '2',
      title: 'Opening Ceremony & Local Artists Showcase',
      description: 'Featuring upcoming reggae artists from Bamenda',
      startDate: '2024-03-15',
      endDate: '2024-03-15',
      time: '16:00',
      location: 'Main Stage',
      type: 'offline',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Football Tournament Finals',
      description: 'Championship match and award ceremony',
      startDate: '2024-03-17',
      endDate: '2024-03-17',
      time: '14:00',
      location: 'Mixico Field',
      type: 'offline',
      status: 'upcoming'
    }
  ],
  tickets: [
    {
      id: '1',
      name: 'Regular Pass',
      price: 5000,
      description: 'Access to all three days of the festival',
      benefits: [
        'Access to all musical performances',
        'Access to food and drink stands',
        'Festival merchandise discount'
      ],
      available: 1000,
      sold: 450,
      maxPerPerson: 4
    },
    {
      id: '2',
      name: 'VIP Pass',
      price: 15000,
      description: 'Premium festival experience with exclusive benefits',
      benefits: [
        'Premium viewing area',
        'Backstage access',
        'Complimentary refreshments',
        'Limited edition festival merchandise',
        'Meet & greet with headliners'
      ],
      available: 100,
      sold: 65,
      maxPerPerson: 2
    }
  ],
  participation: {
    volunteer: {
      type: 'volunteer',
      requirements: [
        'Must be 18 years or older',
        'Available for all three days of the festival',
        'Previous event experience preferred'
      ],
      deadline: '2024-03-01',
      maxSpots: 50,
      currentSpots: 35,
      benefits: [
        'Free festival pass',
        'Staff t-shirt',
        'Meals during shifts',
        'Certificate of participation'
      ],
      responsibilities: [
        'Crowd management',
        'Information desk',
        'Stage support',
        'General logistics'
      ]
    },
    vendor: {
      type: 'vendor',
      requirements: [
        'Valid business registration',
        'Food handlers certificate (for food vendors)',
        'Own equipment and setup'
      ],
      deadline: '2024-03-01',
      maxSpots: 20,
      currentSpots: 12,
      benefits: [
        'High foot traffic location',
        'Power supply',
        'Security',
        '2 vendor passes per booth'
      ]
    }
  },
  categories: ['Music', 'Festival', 'Sports', 'Cultural'],
  tags: ['reggae', 'live music', 'football', 'community'],
  edition: {
    number: 2,
    history: [
      {
        year: 2023,
        highlights: [
          'Over 2000 attendees',
          '15 local artists performed',
          'Cultural exchange program',
          'Community football tournament'
        ],
        images: [
          '/events/2023/highlight1.jpg',
          '/events/2023/highlight2.jpg'
        ]
      }
    ]
  },
  liked: false,
  featured: true
};

export default function EventPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(mockEvent.liked);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'tickets'>('overview');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Event Banner */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <Image
          src={mockEvent.bannerImage || mockEvent.image}
          alt={mockEvent.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={mockEvent.organizer.image}
                alt={mockEvent.organizer.name}
                width={48}
                height={48}
                className="rounded-full border-2 border-white"
              />
              <span className="font-medium">{mockEvent.organizer.name}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{mockEvent.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm mt-4">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>{new Date(mockEvent.startDate).toLocaleDateString()} - {new Date(mockEvent.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>{mockEvent.location.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaVolleyballBall />
                <span>2nd Edition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            {isLiked ? (
              <FaHeart className="w-6 h-6 text-red-500" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-white" />
            )}
          </button>
          <button className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
            <FaShare className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Event Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-4 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-text/60'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`pb-4 px-4 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'activities' ? 'border-primary text-primary' : 'border-transparent text-text/60'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-4 px-4 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'tickets' ? 'border-primary text-primary' : 'border-transparent text-text/60'
            }`}
          >
            Tickets
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Event Description */}
            <div className="prose prose-sm md:prose-base max-w-none text-text">
              <p>{mockEvent.description}</p>
            </div>

            {/* Interactive Features */}
            <EventGamification event={mockEvent} />
            <VenueExplorer event={mockEvent} />
            <LiveEngagement event={mockEvent} />
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-8">
            <EventTimeline activities={mockEvent.activities} />
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-8">
            <TicketSelection tickets={mockEvent.tickets} />
            <ParticipationForm participation={mockEvent.participation} />
          </div>
        )}
      </div>
    </div>
  );
}
