import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaCamera, FaPoll, FaUserFriends } from 'react-icons/fa';
import type { Event } from '@/types/events';

interface LiveEngagementProps {
  event: Event;
}

interface LivePoll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  isActive: boolean;
}

interface LiveMoment {
  id: string;
  type: 'photo' | 'comment' | 'reaction';
  content: string;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: Date;
  likes: number;
}

export default function LiveEngagement({ event }: LiveEngagementProps) {
  const [activePoll, setActivePoll] = useState<LivePoll>({
    id: 'poll1',
    question: "What's your favorite part of the event so far?",
    options: [
      { id: 'opt1', text: 'Main Performance', votes: 45 },
      { id: 'opt2', text: 'Interactive Sessions', votes: 32 },
      { id: 'opt3', text: 'Networking', votes: 28 },
      { id: 'opt4', text: 'Food & Drinks', votes: 15 }
    ],
    totalVotes: 120,
    isActive: true
  });

  const [liveMoments, setLiveMoments] = useState<LiveMoment[]>([
    {
      id: 'm1',
      type: 'photo',
      content: '/events/moment1.jpg',
      user: { name: 'Sarah M.', avatar: '/avatars/1.jpg' },
      timestamp: new Date(),
      likes: 24
    },
    {
      id: 'm2',
      type: 'comment',
      content: 'Amazing performance! 🎉',
      user: { name: 'John D.', avatar: '/avatars/2.jpg' },
      timestamp: new Date(),
      likes: 12
    }
  ]);

  const [showReactionBubble, setShowReactionBubble] = useState(false);
  const [activeTab, setActiveTab] = useState<'moments' | 'polls'>('moments');

  const handleVote = (pollId: string, optionId: string) => {
    setActivePoll(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
      totalVotes: prev.totalVotes + 1
    }));
  };

  const handleReaction = () => {
    setShowReactionBubble(true);
    setTimeout(() => setShowReactionBubble(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Live Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-text">Live Feed</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-text/60">
          <FaUserFriends className="w-4 h-4" />
          <span>234 active participants</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('moments')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'moments' ? 'text-primary' : 'text-text/60'
          }`}
        >
          Live Moments
          {activeTab === 'moments' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('polls')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'polls' ? 'text-primary' : 'text-text/60'
          }`}
        >
          Live Polls
          {activeTab === 'polls' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'moments' ? (
          <motion.div
            key="moments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {liveMoments.map((moment) => (
              <div
                key={moment.id}
                className="bg-surface border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20" />
                  <div>
                    <div className="font-medium text-text">{moment.user.name}</div>
                    <div className="text-sm text-text/60">
                      {moment.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {moment.type === 'photo' ? (
                  <div className="aspect-video bg-background rounded-lg mb-3" />
                ) : (
                  <p className="text-text mb-3">{moment.content}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-text/60">
                  <button
                    onClick={handleReaction}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <FaHeart className="w-4 h-4" />
                    <span>{moment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <FaComment className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <FaShare className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="sticky bottom-4 left-0 right-0">
              <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-full p-2 max-w-xs mx-auto">
                <div className="flex justify-around">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <FaCamera className="w-5 h-5 text-primary" />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <FaComment className="w-5 h-5 text-primary" />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <FaPoll className="w-5 h-5 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="polls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-surface border border-border rounded-xl p-6">
              <h4 className="font-medium text-text mb-4">{activePoll.question}</h4>
              <div className="space-y-3">
                {activePoll.options.map((option) => {
                  const percentage = (option.votes / activePoll.totalVotes) * 100;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(activePoll.id, option.id)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-text">{option.text}</span>
                        <span className="text-sm text-text/60">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-text/60 mt-4">
                {activePoll.totalVotes} total votes
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Reaction Bubble */}
      <AnimatePresence>
        {showReactionBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed bottom-20 right-8 bg-primary text-white rounded-full p-3 shadow-lg"
          >
            <FaHeart className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
