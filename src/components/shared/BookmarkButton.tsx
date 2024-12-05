'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BiBookmark, BiSolidBookmark } from 'react-icons/bi';
import { useBookmarks } from '@/context/AppContext';
import { Bookmark } from '@/types';

interface BookmarkButtonProps {
  itemId: string;
  itemType: Bookmark['itemType'];
  className?: string;
}

export default function BookmarkButton({
  itemId,
  itemType,
  className = '',
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(itemId);

  const handleToggle = () => {
    toggleBookmark({
      id: crypto.randomUUID(),
      userId: 'anonymous', // Replace with actual user ID when available
      itemId,
      itemType,
      createdAt: new Date(),
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`p-2 rounded-lg hover:bg-primary/10 transition-colors ${className}`}
    >
      {bookmarked ? (
        <BiSolidBookmark className="w-5 h-5 text-primary" />
      ) : (
        <BiBookmark className="w-5 h-5 text-text/60" />
      )}
    </motion.button>
  );
}
