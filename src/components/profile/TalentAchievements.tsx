'use client';

import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaCertificate, FaStar } from 'react-icons/fa';

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'award' | 'certification' | 'feature' | 'milestone';
  icon?: string;
}

interface TalentAchievementsProps {
  achievements: Achievement[];
}

export default function TalentAchievements({
  achievements,
}: TalentAchievementsProps) {
  const getIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'award':
        return <FaTrophy className="w-6 h-6 text-yellow-500" />;
      case 'certification':
        return <FaCertificate className="w-6 h-6 text-blue-500" />;
      case 'feature':
        return <FaStar className="w-6 h-6 text-purple-500" />;
      case 'milestone':
        return <FaMedal className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4 p-4 bg-surface border border-border rounded-xl hover:border-primary/50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
            {getIcon(achievement.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-text">{achievement.title}</h3>
              <span className="text-sm text-text/60">{achievement.date}</span>
            </div>
            <p className="mt-1 text-sm text-text/80">{achievement.description}</p>
          </div>
        </motion.div>
      ))}

      {/* Timeline Connector */}
      <div className="relative">
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-border" />
      </div>
    </div>
  );
}
