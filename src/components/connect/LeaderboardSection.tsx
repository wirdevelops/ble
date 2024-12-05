'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiTrophy, BiMedal, BiStar, BiTrendingUp, BiFilterAlt, BiSearch } from 'react-icons/bi';
import { getLeaderboardData, LeaderboardUser, Achievement } from '@/lib/leaderboard';

interface LeaderboardSectionProps {
  searchQuery: string;
}

// Components
const LeaderboardCard = ({ user }: { user: LeaderboardUser }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <BiTrophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <BiMedal className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
      case 3:
        return <BiMedal className="w-6 h-6 text-amber-600 dark:text-amber-500" />;
      default:
        return <span className="text-gray-600 dark:text-gray-400 font-semibold">{rank}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-900/10 transition-all duration-200 p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-10 flex justify-center">
            {getRankIcon(user.rank)}
          </div>
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={user.avatar_url || '/default-avatar.png'}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 md:flex-initial">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.specialty}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 w-full md:w-auto md:ml-auto">
          <div className="text-center flex-1 md:flex-initial">
            <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{user.points}</p>
          </div>
          <div className="text-center flex-1 md:flex-initial">
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
            <div className="flex items-center justify-center gap-1">
              <BiTrendingUp className={`${user.progress >= 80 ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'}`} />
              <p className="font-semibold text-gray-800 dark:text-gray-200">{user.progress}%</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {user.achievements.slice(0, 2).map((achievement, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full whitespace-nowrap"
                title={achievement.description}
              >
                {achievement.name}
              </span>
            ))}
            {user.achievements.length > 2 && (
              <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full whitespace-nowrap">
                +{user.achievements.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LeaderboardSection = ({ searchQuery }: LeaderboardSectionProps) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardData(timeRange);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeRange]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.achievements.some(achievement => 
      achievement.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BiTrophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">Leaderboard</h2>
        </div>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          <select
            className="flex-1 md:flex-initial bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'all' | 'month' | 'week')}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          >
            <BiFilterAlt className="w-4 h-4" />
            <span className="hidden md:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <>
              {filteredUsers.map((user) => (
                <LeaderboardCard key={user.id} user={user} />
              ))}
              {filteredUsers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 dark:text-gray-400">No results found</p>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LeaderboardSection;
