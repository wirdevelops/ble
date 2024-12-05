'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes } from 'react-icons/fa';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  thumbnail: string;
  url: string;
  title: string;
}

interface TalentGalleryProps {
  items: GalleryItem[];
}

export default function TalentGallery({ items }: TalentGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setSelectedItem(item)}
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                  <FaPlay className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>

            <div className="relative w-full max-w-5xl aspect-video">
              {selectedItem.type === 'image' ? (
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
