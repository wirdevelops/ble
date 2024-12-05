'use client';

import TalentCard from '@/components/TalentCard';
import TalentFilters from '@/components/TalentFilters';
import { motion } from 'framer-motion';
import withAuth from '@/components/auth/withAuth'; // Update to default import

// Mock data - Replace with API call
const mockTalents = [
  {
    id: '1',
    name: 'John Doe',
    category: 'Music',
    rating: 4.8,
    reviews: 127,
    location: 'Bamenda, NW',
    image: '/placeholder.jpg',
    skills: ['Vocals', 'Guitar', 'Piano', 'Songwriting'],
    featured: true,
    verified: true,
    available: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    category: 'Dance',
    rating: 4.6,
    reviews: 89,
    location: 'Bamenda, NW',
    image: '/placeholder.jpg',
    skills: ['Contemporary', 'Hip Hop', 'Traditional'],
    verified: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    category: 'Photography',
    rating: 4.9,
    reviews: 156,
    location: 'Bamenda, NW',
    image: '/placeholder.jpg',
    skills: ['Portrait', 'Event', 'Studio', 'Editing'],
    featured: true,
    available: true,
  },
  // Add more mock talents...
];

function TalentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TalentFilters />
      
      <main className="container mx-auto px-4 py-8">
        {/* Results Summary */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text mb-2">Discover Talents</h1>
            <p className="text-text/60">
              Showing {mockTalents.length} talented individuals in Bamenda
            </p>
          </div>
          <select className="bg-surface text-text border border-border rounded-lg px-4 py-2 outline-none focus:border-primary">
            <option value="recommended">Recommended</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockTalents.map((talent, index) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TalentCard talent={talent} />
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-primary text-background rounded-full hover:opacity-90 transition-all">
            Load More Talents
          </button>
        </div>
      </main>
    </div>
  );
}

// Wrap the component with authentication
export default withAuth(TalentsPage, { requireAuth: true, requireOnboarding: true });
