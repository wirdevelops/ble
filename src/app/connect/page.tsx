'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BiMessageSquareDetail,
  BiNetworkChart,
  BiGroup,
  BiBuildings,
  BiBookOpen,
  BiSearch,
  BiPlus,
  BiBell,
  BiTrophy,
} from 'react-icons/bi';
import MessagesSection from '@/components/connect/MessagesSection';
import NetworkingSection from '@/components/connect/NetworkingSection';
import CommunitySection from '@/components/connect/CommunitySection';
import BusinessToolsSection from '@/components/connect/BusinessToolsSection';
import ProfessionalDevelopmentSection from '@/components/connect/ProfessionalDevelopmentSection';
import LeaderboardSection from '@/components/connect/LeaderboardSection';
import { withAuth } from '@/components/auth/withAuth';

// Types
interface Tab {
  id: string;
  label: string;
  icon: any;
  count?: number;
}

interface Notification {
  id: number;
  type: 'message' | 'connection' | 'community' | 'business' | 'learning';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// Mock Data
const notifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    title: 'New Message',
    description: 'Sarah Johnson sent you a message',
    time: '5m ago',
    read: false,
  },
  {
    id: 2,
    type: 'connection',
    title: 'Connection Request',
    description: 'John Smith wants to connect',
    time: '15m ago',
    read: false,
  },
  {
    id: 3,
    type: 'community',
    title: 'Community Update',
    description: 'New event in Tech Innovators',
    time: '1h ago',
    read: true,
  },
];

const tabs: Tab[] = [
  { id: 'messages', label: 'Messages', icon: BiMessageSquareDetail, count: 3 },
  { id: 'networking', label: 'Networking', icon: BiNetworkChart, count: 5 },
  { id: 'community', label: 'Community', icon: BiGroup },
  { id: 'business', label: 'Business Tools', icon: BiBuildings },
  { id: 'learning', label: 'Professional Development', icon: BiBookOpen },
  { id: 'leaderboard', label: 'Leaderboard', icon: BiTrophy },
];

function ConnectPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(notifications.filter(n => !n.read).length);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'messages':
        return <MessagesSection searchQuery={searchQuery} />;
      case 'networking':
        return <NetworkingSection searchQuery={searchQuery} />;
      case 'community':
        return <CommunitySection searchQuery={searchQuery} />;
      case 'business':
        return <BusinessToolsSection searchQuery={searchQuery} />;
      case 'learning':
        return <ProfessionalDevelopmentSection searchQuery={searchQuery} />;
      case 'leaderboard':
        return <LeaderboardSection searchQuery={searchQuery} />;
      default:
        return <MessagesSection searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text">Connect</h1>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-surface rounded-lg border border-border focus:border-primary focus:outline-none"
              />
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
            </div>
            
            {/* Add New Button */}
            <button className="p-2 rounded-lg bg-surface border border-border hover:border-primary transition-colors">
              <BiPlus className="w-5 h-5 text-text" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-surface border border-border hover:border-primary transition-colors"
              >
                <BiBell className="w-5 h-5 text-text" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-text">Notifications</h3>
                        <button
                          onClick={() => {
                            setUnreadNotifications(0);
                            notifications.forEach(n => n.read = true);
                          }}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg ${
                              notification.read ? 'bg-surface' : 'bg-primary/5'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-text">{notification.title}</h4>
                                <p className="text-sm text-text/60">{notification.description}</p>
                                <span className="text-xs text-text/40">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mb-8">
          <div className="border-b border-border">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text/60 hover:text-text hover:border-border'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.count && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default withAuth(ConnectPage, { requireAuth: true, requireOnboarding: true });
