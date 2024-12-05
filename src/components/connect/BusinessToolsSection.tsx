import { motion } from 'framer-motion';
import { BiBuildings, BiTrendingUp, BiDollarCircle, BiCalendarEvent } from 'react-icons/bi';

const businessTools = [
  {
    id: 1,
    name: 'Market Analysis',
    description: 'Access market trends and industry insights',
    icon: BiTrendingUp,
    stats: '24 reports',
  },
  {
    id: 2,
    name: 'Investment Opportunities',
    description: 'Discover potential investment and funding options',
    icon: BiDollarCircle,
    stats: '12 opportunities',
  },
  {
    id: 3,
    name: 'Business Events',
    description: 'Stay updated with business events and conferences',
    icon: BiCalendarEvent,
    stats: '8 upcoming',
  },
];

const opportunities = [
  {
    id: 1,
    title: 'Tech Startup Investment',
    type: 'Investment',
    amount: '$50K - $200K',
    sector: 'Technology',
    deadline: '30 days left',
  },
  {
    id: 2,
    title: 'E-commerce Partnership',
    type: 'Partnership',
    sector: 'E-commerce',
    location: 'Douala',
    deadline: '15 days left',
  },
  {
    id: 3,
    title: 'Business Expansion Grant',
    type: 'Grant',
    amount: 'Up to $100K',
    sector: 'Multiple Sectors',
    deadline: '45 days left',
  },
];

const events = [
  {
    id: 1,
    title: 'Business Innovation Summit',
    date: 'Mar 20, 2024',
    location: 'Yaoundé Convention Center',
    attendees: 250,
  },
  {
    id: 2,
    title: 'Entrepreneurship Workshop',
    date: 'Apr 5, 2024',
    location: 'Tech Hub Douala',
    attendees: 100,
  },
  {
    id: 3,
    title: 'Investor Networking Event',
    date: 'Apr 15, 2024',
    location: 'Business Center Bamenda',
    attendees: 150,
  },
];

export default function BusinessToolsSection() {
  return (
    <div className="space-y-8">
      {/* Business Tools Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businessTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text">{tool.name}</h3>
                  <p className="text-sm text-text/60">{tool.stats}</p>
                </div>
              </div>
              <p className="text-sm text-text/60">{tool.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Business Opportunities */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Business Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BiDollarCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text">{opportunity.title}</h3>
                  <p className="text-sm text-primary">{opportunity.type}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-text/60">
                {opportunity.amount && (
                  <div className="flex items-center justify-between">
                    <span>Investment Range</span>
                    <span className="font-medium text-text">{opportunity.amount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Sector</span>
                  <span className="font-medium text-text">{opportunity.sector}</span>
                </div>
                {opportunity.location && (
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span className="font-medium text-text">{opportunity.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Deadline</span>
                  <span className="font-medium text-text">{opportunity.deadline}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Business Events */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-4 rounded-xl border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BiCalendarEvent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-text">{event.title}</h3>
                    <span className="text-sm text-primary">{event.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text/60">{event.location}</span>
                    <span className="text-text/60">{event.attendees} attendees</span>
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
