import { motion } from 'framer-motion';
import { BiGroup, BiCalendarEvent, BiMessageDetail, BiTrophy } from 'react-icons/bi';

const communities = [
  {
    id: 1,
    name: 'Tech Innovators',
    members: 1500,
    description: 'A community of tech enthusiasts and innovators',
    activities: 12,
    upcoming: 3,
  },
  {
    id: 2,
    name: 'Business Leaders',
    members: 2300,
    description: 'Connect with business leaders and entrepreneurs',
    activities: 8,
    upcoming: 2,
  },
  {
    id: 3,
    name: 'Creative Hub',
    members: 980,
    description: 'A space for creative professionals to collaborate',
    activities: 15,
    upcoming: 4,
  },
];

const activities = [
  {
    id: 1,
    type: 'event',
    title: 'Tech Meetup 2024',
    description: 'Join us for our annual tech meetup',
    date: 'Mar 15, 2024',
    participants: 45,
  },
  {
    id: 2,
    type: 'discussion',
    title: 'Future of AI in Business',
    description: 'Discussion on AI implementation in business',
    date: 'Today',
    participants: 28,
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Community Milestone',
    description: 'Reached 1000 active members',
    date: 'Yesterday',
    participants: 1000,
  },
];

export default function CommunitySection() {
  return (
    <div className="space-y-8">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface p-6 rounded-xl border border-border"
        >
          <h3 className="text-lg font-semibold text-text mb-2">Communities</h3>
          <div className="flex items-center gap-2">
            <BiGroup className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-text">12</span>
          </div>
          <p className="text-sm text-text/60 mt-1">Active memberships</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface p-6 rounded-xl border border-border"
        >
          <h3 className="text-lg font-semibold text-text mb-2">Events</h3>
          <div className="flex items-center gap-2">
            <BiCalendarEvent className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-text">8</span>
          </div>
          <p className="text-sm text-text/60 mt-1">Upcoming events</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface p-6 rounded-xl border border-border"
        >
          <h3 className="text-lg font-semibold text-text mb-2">Discussions</h3>
          <div className="flex items-center gap-2">
            <BiMessageDetail className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-text">24</span>
          </div>
          <p className="text-sm text-text/60 mt-1">Active discussions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface p-6 rounded-xl border border-border"
        >
          <h3 className="text-lg font-semibold text-text mb-2">Achievements</h3>
          <div className="flex items-center gap-2">
            <BiTrophy className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-text">15</span>
          </div>
          <p className="text-sm text-text/60 mt-1">Community badges</p>
        </motion.div>
      </div>

      {/* Communities */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Your Communities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BiGroup className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text">{community.name}</h3>
                  <p className="text-sm text-text/60">{community.members} members</p>
                </div>
              </div>
              <p className="text-sm text-text/60 mb-4">{community.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text/60">{community.activities} activities</span>
                <span className="text-primary">{community.upcoming} upcoming</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-4 rounded-xl border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {activity.type === 'event' && <BiCalendarEvent className="w-5 h-5 text-primary" />}
                  {activity.type === 'discussion' && <BiMessageDetail className="w-5 h-5 text-primary" />}
                  {activity.type === 'achievement' && <BiTrophy className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-text">{activity.title}</h3>
                    <span className="text-xs text-text/60">{activity.date}</span>
                  </div>
                  <p className="text-sm text-text/60 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-text/60">
                    <BiGroup className="w-4 h-4" />
                    <span>{activity.participants} participants</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
