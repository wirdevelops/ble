import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    price: number;
    categories: string[];
    liked: boolean;
  };
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(event.liked);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-surface rounded-2xl overflow-hidden border border-border ${
        featured ? 'shadow-lg' : ''
      }`}
    >
      <div className="relative">
        <Image
          src={event.image}
          alt={event.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          {isLiked ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-text/60" />
          )}
        </button>
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-sm font-medium">
          {event.price.toLocaleString()} FCFA
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-text line-clamp-2">{event.title}</h3>

        <div className="space-y-2 text-sm text-text/60">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
            <FaClock className="w-4 h-4 ml-2" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {event.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
