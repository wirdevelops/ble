'use client';

import { FaMusic, FaTheaterMasks, FaPalette, FaVolleyballBall, FaMicrophoneAlt, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { id: 1, name: 'Music', icon: FaMusic, count: 124 },
  { id: 2, name: 'Dance', icon: FaTheaterMasks, count: 85 },
  { id: 3, name: 'Art', icon: FaPalette, count: 67 },
  { id: 4, name: 'Sports', icon: FaVolleyballBall, count: 93 },
  { id: 5, name: 'Voice', icon: FaMicrophoneAlt, count: 45 },
  { id: 6, name: 'Photography', icon: FaCamera, count: 72 },
];

export default function TalentCategories() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-text mb-8">Explore Talents</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Link 
            href={`/explore?category=${category.name.toLowerCase()}`}
            key={category.id}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-6 rounded-xl border border-border hover:border-primary cursor-pointer group transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-text">{category.name}</h3>
                <span className="text-sm text-text/60">{category.count} talents</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
