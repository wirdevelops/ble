import { motion } from 'framer-motion';
import { BiTrendingUp, BiGroup, BiMoney, BiHeart } from 'react-icons/bi';
import type { Event } from '@/types/events';

interface EventAnalyticsProps {
  event: Event;
}

export default function EventAnalytics({ event }: EventAnalyticsProps) {
  const metrics = [
    {
      title: 'Tickets Sold',
      value: event.analytics?.ticketsSold || 0,
      icon: BiGroup,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Revenue',
      value: event.analytics?.revenue?.toLocaleString() + ' XAF' || '0 XAF',
      icon: BiMoney,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Engagement Rate',
      value: (event.analytics?.engagementRate || 0) + '%',
      icon: BiHeart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Satisfaction Score',
      value: event.analytics?.satisfactionScore?.toFixed(1) + '/5' || '0/5',
      icon: BiTrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const engagementMetrics = [
    {
      title: 'Likes',
      value: event.engagement?.likes || 0,
      color: 'text-red-500',
    },
    {
      title: 'Shares',
      value: event.engagement?.shares || 0,
      color: 'text-blue-500',
    },
    {
      title: 'Comments',
      value: event.engagement?.comments || 0,
      color: 'text-green-500',
    },
    {
      title: 'RSVPs',
      value: event.engagement?.rsvps || 0,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface p-4 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text/60 mb-1">{metric.title}</p>
                <p className="text-2xl font-semibold">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Engagement Metrics */}
      <div className="bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {engagementMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </p>
              <p className="text-sm text-text/60">{metric.title}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Capacity Stats */}
      <div className="bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Attendance Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* In-Person Attendance */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text/60">In-Person Attendance</span>
              <span className="text-sm font-medium">
                {event.attendees?.inPerson || 0}/{event.attendees?.capacity?.inPerson || 0}
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((event.attendees?.inPerson || 0) / (event.attendees?.capacity?.inPerson || 1)) * 100}%`
                }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          {/* Virtual Attendance */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text/60">Virtual Attendance</span>
              <span className="text-sm font-medium">
                {event.attendees?.virtual || 0}/{event.attendees?.capacity?.virtual || 0}
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((event.attendees?.virtual || 0) / (event.attendees?.capacity?.virtual || 1)) * 100}%`
                }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
