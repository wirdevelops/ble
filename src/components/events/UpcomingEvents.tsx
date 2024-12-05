import { motion } from 'framer-motion';
import EventCard from './EventCard';

interface UpcomingEventsProps {
  events: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    price: number;
    categories: string[];
    liked: boolean;
  }[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {events.map((event) => (
        <motion.div key={event.id} variants={item}>
          <EventCard event={event} />
        </motion.div>
      ))}
    </motion.div>
  );
}
