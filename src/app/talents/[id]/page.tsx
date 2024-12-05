'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFacebook,
} from 'react-icons/fa';
import TalentGallery from '@/components/profile/TalentGallery';
import TalentReviews from '@/components/profile/TalentReviews';
import TalentCalendar from '@/components/profile/TalentCalendar';
import TalentPricing from '@/components/profile/TalentPricing';
import TalentChat from '@/components/profile/TalentChat';
import TalentAchievements from '@/components/profile/TalentAchievements';
import SimilarTalents from '@/components/profile/SimilarTalents';

// Mock data - Replace with API call
const mockTalent = {
  id: '1',
  name: 'John Doe',
  category: 'Music',
  rating: 4.8,
  reviews: 127,
  location: 'Bamenda, NW',
  image: '/placeholder.jpg',
  coverImage: '/placeholder-cover.jpg',
  bio: 'Professional musician with over 10 years of experience. Specializing in guitar, piano, and vocals. Available for events, collaborations, and private lessons.',
  skills: ['Vocals', 'Guitar', 'Piano', 'Songwriting'],
  achievements: [
    'Winner of Bamenda Music Awards 2022',
    'Featured on National TV',
    'Performed at major festivals',
  ],
  pricing: {
    hourly: 50,
    daily: 300,
    event: 'Custom',
  },
  gallery: [
    {
      id: '1',
      type: 'image',
      thumbnail: '/placeholder.jpg',
      url: '/placeholder.jpg',
      title: 'Live Performance',
    },
    // Add more gallery items...
  ],
  reviews: [
    {
      id: '1',
      user: {
        name: 'Alice Johnson',
        image: '/placeholder.jpg',
      },
      rating: 5,
      date: '2023-12-15',
      comment: 'Amazing performance! John is not only talented but also very professional.',
      likes: 12,
    },
    // Add more reviews...
  ],
  availableSlots: {
    '2024-01-20': [
      {
        id: '1',
        startTime: '09:00',
        endTime: '10:00',
        available: true,
      },
      // Add more slots...
    ],
  },
  socialLinks: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
  },
};

const mockPricing = [
  {
    id: '1',
    name: 'Basic',
    price: 50,
    duration: 'hour',
    description: 'Perfect for small events and private lessons',
    features: [
      '1-hour session',
      'Basic equipment provided',
      'Digital recordings',
      'One revision',
    ],
  },
  {
    id: '2',
    name: 'Standard',
    price: 300,
    duration: 'day',
    description: 'Ideal for events and collaborations',
    features: [
      'Full-day availability',
      'Professional equipment',
      'HD recordings',
      'Multiple revisions',
      'Social media content',
    ],
    popular: true,
  },
  {
    id: '3',
    name: 'Premium',
    price: 1000,
    duration: 'project',
    description: 'Complete professional service',
    features: [
      'Multiple day booking',
      'Top-tier equipment',
      '4K video production',
      'Unlimited revisions',
      'Marketing materials',
      'Venue booking assistance',
    ],
  },
];

const mockMessages = [
  {
    id: '1',
    content: 'Hi, I\'m interested in your music services',
    sender: 'user',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    content: 'Hello! Thanks for reaching out. How can I help you today?',
    sender: 'talent',
    timestamp: '10:32 AM',
  },
];

const mockAchievements = [
  {
    id: '1',
    title: 'Bamenda Music Awards 2022',
    date: 'December 2022',
    description: 'Winner of Best Musical Performance',
    type: 'award',
  },
  {
    id: '2',
    title: 'Professional Music Production',
    date: 'June 2022',
    description: 'Certified by Berkeley School of Music',
    type: 'certification',
  },
  {
    id: '3',
    title: 'National TV Feature',
    date: 'March 2023',
    description: 'Featured performance on CRTV prime time',
    type: 'feature',
  },
];

const mockSimilarTalents = [
  {
    id: '2',
    name: 'Jane Smith',
    category: 'Music',
    image: '/placeholder.jpg',
    rating: 4.7,
    reviews: 89,
    matchPercentage: 95,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    category: 'Music',
    image: '/placeholder.jpg',
    rating: 4.9,
    reviews: 156,
    matchPercentage: 85,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    category: 'Music',
    image: '/placeholder.jpg',
    rating: 4.6,
    reviews: 72,
    matchPercentage: 80,
  },
];

export default function TalentProfilePage() {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'portfolio' | 'pricing' | 'achievements' | 'reviews' | 'calendar'
  >('portfolio');

  const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'calendar', label: 'Book Now' },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96">
        <Image
          src={mockTalent.coverImage}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-32">
          <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Profile Image */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden">
                <Image
                  src={mockTalent.image}
                  alt={mockTalent.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text">
                      {mockTalent.name}
                    </h1>
                    <p className="text-text/60 mt-1">{mockTalent.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface/80 transition-colors"
                    >
                      {isLiked ? (
                        <FaHeart className="w-5 h-5 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-5 h-5 text-text" />
                      )}
                    </button>
                    <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface/80 transition-colors">
                      <FaShare className="w-5 h-5 text-text" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-text">
                      {mockTalent.rating}
                    </span>
                    <span className="text-text/60">
                      ({mockTalent.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-text/60">
                    <FaMapMarkerAlt className="w-5 h-5" />
                    {mockTalent.location}
                  </div>
                </div>

                <p className="mt-4 text-text/80 leading-relaxed">
                  {mockTalent.bio}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {mockTalent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-4 mt-6">
                  <a
                    href={mockTalent.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text/60 hover:text-text transition-colors"
                  >
                    <FaInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href={mockTalent.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text/60 hover:text-text transition-colors"
                  >
                    <FaTwitter className="w-6 h-6" />
                  </a>
                  <a
                    href={mockTalent.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text/60 hover:text-text transition-colors"
                  >
                    <FaYoutube className="w-6 h-6" />
                  </a>
                  <a
                    href={mockTalent.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text/60 hover:text-text transition-colors"
                  >
                    <FaFacebook className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-4 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-text/60 hover:text-text'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {activeTab === 'portfolio' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TalentGallery items={mockTalent.gallery} />
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TalentPricing
                  packages={mockPricing}
                  onSelectPackage={(packageId) => {
                    setActiveTab('calendar');
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TalentAchievements achievements={mockAchievements} />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TalentReviews reviews={mockTalent.reviews} />
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TalentCalendar availableSlots={mockTalent.availableSlots} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Talents */}
      <div className="container mx-auto px-4 mt-16">
        <SimilarTalents talents={mockSimilarTalents} />
      </div>

      {/* Chat */}
      <TalentChat
        talentName={mockTalent.name}
        talentImage={mockTalent.image}
        messages={mockMessages}
        onSendMessage={(message) => {
          console.log('Sending message:', message);
          // Implement message sending logic
        }}
      />
    </div>
  );
}
