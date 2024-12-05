'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaStar, FaMapMarkerAlt, FaBookmark } from 'react-icons/fa';
import { useState } from 'react';

interface TalentCardProps {
  talent: {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    image: string;
    skills: string[];
    featured?: boolean;
    verified?: boolean;
    available?: boolean;
  };
}

export default function TalentCard({ talent }: TalentCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all group"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={talent.image}
          alt={talent.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {talent.featured && (
            <span className="px-2 py-1 bg-primary text-background text-xs rounded-full">
              Featured
            </span>
          )}
          {talent.verified && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Verified
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-background/30 transition-all"
          >
            {isLiked ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-white" />
            )}
          </button>
          <button className="w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-background/30 transition-all">
            <FaBookmark className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Availability Badge */}
        {talent.available && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Available
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-text">{talent.name}</h3>
            <p className="text-sm text-text/60">{talent.category}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-text">{talent.rating}</span>
            <span className="text-sm text-text/60">({talent.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-text/60 mb-3">
          <FaMapMarkerAlt className="w-4 h-4" />
          {talent.location}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {talent.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {talent.skills.length > 3 && (
            <span className="px-2 py-1 bg-surface text-text/60 text-xs rounded-full">
              +{talent.skills.length - 3} more
            </span>
          )}
        </div>

        <Link
          href={`/talents/${talent.id}`}
          className="block w-full py-2 text-center bg-primary text-background rounded-full hover:opacity-90 transition-all"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
