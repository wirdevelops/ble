import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt, FaUser } from 'react-icons/fa';

interface FeaturedEventProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    price: {
      regular: number;
      vip: number;
    };
    organizer: {
      name: string;
      image: string;
    };
    categories: string[];
    attendees: number;
    liked: boolean;
  };
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  const [isLiked, setIsLiked] = useState(event.liked);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl overflow-hidden border border-border shadow-lg"
    >
      <div className="relative h-72 md:h-96">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={event.organizer.image}
              alt={event.organizer.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
            <span className="font-medium">{event.organizer.name}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-white/80 line-clamp-2 mb-4">{event.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser />
              <span>{event.attendees.toLocaleString()} attending</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          {isLiked ? (
            <FaHeart className="w-6 h-6 text-red-500" />
          ) : (
            <FaRegHeart className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <div className="p-6 flex flex-wrap gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            {event.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-text/60 mb-1">Regular Ticket</div>
            <div className="text-xl font-bold text-text">
              {event.price.regular.toLocaleString()} FCFA
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-text/60 mb-1">VIP Ticket</div>
            <div className="text-xl font-bold text-text">
              {event.price.vip.toLocaleString()} FCFA
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium flex items-center gap-2"
          >
            <FaTicketAlt />
            Get Tickets
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
