import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiVideo, BiMicrophone, BiChat, BiQuestionMark, BiPoll } from 'react-icons/bi';
import type { Event } from '@/types/events';

interface VirtualEventHubProps {
  event: Event;
}

export default function VirtualEventHub({ event }: VirtualEventHubProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'qa' | 'chat'>('stream');

  const features = [
    {
      icon: BiVideo,
      title: 'Live Streaming',
      description: 'Watch the event in real-time with our HD streaming service',
    },
    {
      icon: BiQuestionMark,
      title: 'Q&A Sessions',
      description: 'Interact with speakers and ask questions during the event',
    },
    {
      icon: BiChat,
      title: 'Live Chat',
      description: 'Connect with other attendees in real-time',
    },
    {
      icon: BiPoll,
      title: 'Live Polls',
      description: 'Participate in polls and surveys during the event',
    },
  ];

  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {/* Virtual Event Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Virtual Event Access</h3>
          <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
            {event.type === 'hybrid' ? 'Hybrid Event' : 'Virtual Event'}
          </span>
        </div>
        <p className="text-text/60">
          Join us virtually and experience the event from anywhere in the world.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-surface"
          >
            <feature.icon className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-medium mb-2">{feature.title}</h4>
            <p className="text-sm text-text/60">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Virtual Access Controls */}
      <div className="p-6">
        <div className="flex gap-4 mb-6">
          {(['stream', 'qa', 'chat'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-background text-text hover:bg-primary/10'
              }`}
            >
              {tab === 'qa' ? 'Q&A' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stream View */}
        {activeTab === 'stream' && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <BiVideo className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80">Stream will begin at event time</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <BiMicrophone className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <BiVideo className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <BiChat className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Q&A View */}
        {activeTab === 'qa' && (
          <div className="bg-background rounded-lg p-4 min-h-[300px]">
            <p className="text-center text-text/60 py-8">
              Q&A session will be available during the event
            </p>
          </div>
        )}

        {/* Chat View */}
        {activeTab === 'chat' && (
          <div className="bg-background rounded-lg p-4 min-h-[300px]">
            <p className="text-center text-text/60 py-8">
              Chat will be available during the event
            </p>
          </div>
        )}
      </div>

      {/* Recording Access */}
      {event.virtualAccess?.recordingAvailable && (
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">Recording Access</h4>
              <p className="text-sm text-text/60">
                Can't make it to the live event? Recording will be available after the event.
              </p>
            </div>
            <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
              Pre-order Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
