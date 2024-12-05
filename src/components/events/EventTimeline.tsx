import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import type { EventActivity } from '@/types/events';

interface EventTimelineProps {
  activities: EventActivity[];
}

export default function EventTimeline({ activities }: EventTimelineProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text">Event Schedule</h2>
      
      <div className="space-y-4">
        {sortedActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 pb-8 last:pb-0"
          >
            {/* Timeline line */}
            {index !== sortedActivities.length - 1 && (
              <div className="absolute left-[15px] top-6 bottom-0 w-0.5 bg-border" />
            )}
            
            {/* Timeline dot */}
            <div className={`absolute left-0 top-2 w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${activity.status === 'completed' ? 'border-success bg-success/20 text-success' :
                activity.status === 'ongoing' ? 'border-primary bg-primary/20 text-primary' :
                'border-border bg-surface text-text/60'}`}
            >
              <div className="w-3 h-3 rounded-full bg-current" />
            </div>

            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                <h3 className="text-lg font-medium text-text">{activity.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-text/60">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary" />
                    <span>
                      {new Date(activity.startDate).toLocaleDateString()} {activity.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-text/80">{activity.description}</p>

              {activity.currentParticipants && (
                <div className="mt-3 text-sm text-text/60">
                  {activity.currentParticipants} participants
                </div>
              )}

              {activity.status === 'upcoming' && (
                <button className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                  Set Reminder
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
