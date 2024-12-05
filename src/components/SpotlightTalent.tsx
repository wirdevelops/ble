'use client';

import { motion } from 'framer-motion';
import { FaPlay, FaHeart, FaShare } from 'react-icons/fa';
import Image from 'next/image';

const spotlightTalents = [
  {
    id: 1,
    name: 'Sarah Johnson',
    talent: 'Vocalist',
    image: '/placeholder.jpg',
    views: '2.5K',
    likes: '487',
    description: 'Rising star with a unique blend of Afro-pop and soul music.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    talent: 'Dance',
    image: '/placeholder.jpg',
    views: '1.8K',
    likes: '342',
    description: 'Contemporary dancer specializing in African fusion choreography.',
  },
  {
    id: 3,
    name: 'David Williams',
    talent: 'Artist',
    image: '/placeholder.jpg',
    views: '3.1K',
    likes: '629',
    description: 'Digital artist creating stunning African-inspired artwork.',
  },
];

export default function SpotlightTalent() {
  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text">Talent Spotlight</h2>
        <button className="text-primary hover:text-primary/80">View All</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spotlightTalents.map((talent, index) => (
          <motion.div
            key={talent.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="bg-surface rounded-xl overflow-hidden group"
          >
            <div className="relative aspect-video">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image
                src={talent.image}
                alt={talent.name}
                fill
                className="object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20
                         w-12 h-12 bg-primary rounded-full flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaPlay className="w-4 h-4 text-background ml-1" />
              </motion.button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-text">{talent.name}</h3>
                  <p className="text-sm text-text/60">{talent.talent}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-text/60 hover:text-primary">
                    <FaHeart className="w-4 h-4" />
                  </button>
                  <button className="text-text/60 hover:text-primary">
                    <FaShare className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-text/80 mb-3">{talent.description}</p>
              
              <div className="flex justify-between text-sm text-text/60">
                <span>{talent.views} views</span>
                <span>{talent.likes} likes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
