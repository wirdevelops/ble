import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaUsers, FaStar, FaTicketAlt, FaShare, FaCamera } from 'react-icons/fa';
import type { Event } from '@/types/events';

interface EventGamificationProps {
  event: Event;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export default function EventGamification({ event }: EventGamificationProps) {
  const [showReward, setShowReward] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  const achievements: Achievement[] = [
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Register for the event 2 weeks in advance',
      icon: FaTicketAlt,
      points: 100,
      progress: 1,
      maxProgress: 1,
      unlocked: true
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Share the event on 3 different platforms',
      icon: FaShare,
      points: 50,
      progress: 2,
      maxProgress: 3,
      unlocked: false
    },
    {
      id: 'photo_enthusiast',
      title: 'Photo Enthusiast',
      description: 'Upload 5 event photos',
      icon: FaCamera,
      points: 75,
      progress: 3,
      maxProgress: 5,
      unlocked: false
    }
  ];

  const leaderboard = [
    { name: 'John D.', points: 450, avatar: '/avatars/1.jpg' },
    { name: 'Sarah M.', points: 380, avatar: '/avatars/2.jpg' },
    { name: 'Mike R.', points: 320, avatar: '/avatars/3.jpg' }
  ];

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const progressToNextLevel = (points: number) => {
    return (points % 100) / 100;
  };

  useEffect(() => {
    // Simulate points accumulation
    const interval = setInterval(() => {
      setUserPoints(prev => {
        const newPoints = prev + 10;
        const newLevel = calculateLevel(newPoints);
        if (newLevel > userLevel) {
          setShowReward(true);
          setUserLevel(newLevel);
        }
        return newPoints;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [userLevel]);

  return (
    <div className="space-y-6">
      {/* User Progress */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text">Level {userLevel}</h3>
            <p className="text-sm text-text/60">{userPoints} points</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <FaTrophy className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel(userPoints) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-text/60 mt-2">
          {100 - (userPoints % 100)} points to next level
        </p>
      </div>

      {/* Achievements */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Achievements</h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked ? 'border-primary/50 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-primary/20 text-primary' : 'bg-background text-text/40'
                }`}>
                  <achievement.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-text">{achievement.title}</h4>
                    <span className="text-sm text-text/60">+{achievement.points}pts</span>
                  </div>
                  <p className="text-sm text-text/60">{achievement.description}</p>
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-text/60 mt-1">
                        {achievement.progress}/{achievement.maxProgress} completed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Top Participants</h3>
        <div className="space-y-4">
          {leaderboard.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-background"
            >
              <div className="w-8 h-8 flex items-center justify-center font-semibold text-primary">
                #{index + 1}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-text">{user.name}</div>
                <div className="text-sm text-text/60">{user.points} points</div>
              </div>
              {index === 0 && (
                <div className="text-yellow-500">
                  <FaTrophy className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Level Up Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReward(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-border rounded-xl p-8 text-center max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <FaTrophy className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">Level Up!</h3>
              <p className="text-text/60 mb-6">
                Congratulations! You've reached Level {userLevel}
              </p>
              <div className="text-sm text-text/60 mb-6">
                Rewards unlocked:
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2">
                    <FaTicketAlt className="text-primary" />
                    <span>10% discount on next ticket purchase</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaStar className="text-primary" />
                    <span>Early access to future events</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setShowReward(false)}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Claim Rewards
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
