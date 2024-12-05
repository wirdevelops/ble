'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SimilarTalent {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  matchPercentage: number;
}

interface SimilarTalentsProps {
  talents: SimilarTalent[];
}

export default function SimilarTalents({ talents }: SimilarTalentsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleTalents = talents.slice(startIndex, startIndex + 3);

  const nextSlide = () => {
    if (startIndex + 3 < talents.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text">Similar Talents</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={startIndex === 0}
            className="p-2 rounded-full bg-surface border border-border hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="w-4 h-4 text-text" />
          </button>
          <button
            onClick={nextSlide}
            disabled={startIndex + 3 >= talents.length}
            className="p-2 rounded-full bg-surface border border-border hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight className="w-4 h-4 text-text" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTalents.map((talent) => (
          <Link key={talent.id} href={`/talents/${talent.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={talent.image}
                  alt={talent.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Match Percentage */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-background text-sm rounded-full">
                  {talent.matchPercentage}% Match
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                  {talent.name}
                </h3>
                <p className="text-sm text-text/60 mt-1">{talent.category}</p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-text">
                      {talent.rating}
                    </span>
                  </div>
                  <span className="text-sm text-text/60">
                    ({talent.reviews} reviews)
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
