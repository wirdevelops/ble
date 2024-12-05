'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { FiX, FiCheck, FiArrowRight, FiStar, FiUsers, FiCalendar, FiDollarSign, FiAward } from 'react-icons/fi';
import { MdEventAvailable, MdVolunteerActivism, MdBusinessCenter, MdGroups } from 'react-icons/md';
import { IoMusicalNotesOutline, IoFootballOutline } from 'react-icons/io5';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeatureTab = 'overview' | 'features' | 'howItWorks' | 'getStarted';

const tabData = {
  overview: {
    title: "Welcome to BLE",
    description: "Your gateway to Bamenda's most vibrant community of talents, professionals, and opportunities.",
    steps: [
      {
        title: "Diverse Opportunities",
        description: "From cultural festivals to sports tournaments, business investments to volunteer positions - find your perfect match.",
        icon: <MdEventAvailable className="w-6 h-6" />
      },
      {
        title: "Connect & Collaborate",
        description: "Network with talents, mentors, businesses, and event organizers all in one platform.",
        icon: <MdGroups className="w-6 h-6" />
      },
      {
        title: "Live Updates",
        description: "Stay updated with live events, ongoing tournaments, and real-time activities across Bamenda.",
        icon: <FiCalendar className="w-6 h-6" />
      },
      {
        title: "Growth Opportunities",
        description: "Whether you're a talent seeking exposure or a business looking to invest, BLE opens doors.",
        icon: <FiAward className="w-6 h-6" />
      }
    ]
  },
  features: {
    title: "Platform Features",
    cards: [
      {
        title: "Event Management",
        description: "Organize and manage multi-activity events like the Bamenda 3 Day Reggae Festival",
        icon: <MdEventAvailable className="w-6 h-6" />
      },
      {
        title: "Talent Showcase",
        description: "Premium profiles for performers, artists, and creative professionals",
        icon: <IoMusicalNotesOutline className="w-6 h-6" />
      },
      {
        title: "Live Activities",
        description: "Real-time updates for sports tournaments, performances, and events",
        icon: <IoFootballOutline className="w-6 h-6" />
      },
      {
        title: "Business Opportunities",
        description: "Investment opportunities and talent partnerships for businesses",
        icon: <MdBusinessCenter className="w-6 h-6" />
      },
      {
        title: "Volunteer Portal",
        description: "Sign up for volunteer opportunities at upcoming events",
        icon: <MdVolunteerActivism className="w-6 h-6" />
      },
      {
        title: "Community Hub",
        description: "Connect with mentors, join bands, or find business partners",
        icon: <FiUsers className="w-6 h-6" />
      }
    ]
  },
  howItWorks: {
    title: "How It Works",
    steps: [
      {
        title: "Choose Your Role",
        description: "Join as a talent, business, volunteer, or community member",
        icon: <FiUsers className="w-6 h-6" />
      },
      {
        title: "Complete Your Profile",
        description: "Showcase your skills, interests, or business offerings",
        icon: <FiStar className="w-6 h-6" />
      },
      {
        title: "Explore Opportunities",
        description: "Discover events, performances, investments, or volunteer positions",
        icon: <MdEventAvailable className="w-6 h-6" />
      },
      {
        title: "Connect & Grow",
        description: "Network, collaborate, and thrive within the community",
        icon: <FiDollarSign className="w-6 h-6" />
      }
    ]
  },
  getStarted: {
    title: "Join BLE Today",
    options: [
      {
        title: "Talent Registration",
        description: "For performers, artists, and creative professionals",
        buttonText: "Register as Talent"
      },
      {
        title: "Business Account",
        description: "For investors, event organizers, and businesses",
        buttonText: "Create Business Account"
      },
      {
        title: "Volunteer Sign-up",
        description: "For event volunteers and community supporters",
        buttonText: "Join as Volunteer"
      },
      {
        title: "Community Member",
        description: "For general community participation and updates",
        buttonText: "Join Community"
      }
    ]
  }
};

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [activeTab, setActiveTab] = useState<FeatureTab>('overview');

  const tabs = ['overview', 'features', 'howItWorks', 'getStarted'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tabData.overview.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text">{step.title}</h3>
                    <p className="text-text/60 text-sm">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'features':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tabData.features.cards.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">{feature.title}</h3>
                    <p className="text-text/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'howItWorks':
        return (
          <div className="space-y-6">
            {tabData.howItWorks.steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1 bg-background rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    {item.icon}
                    <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                  </div>
                  <p className="text-text/60">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'getStarted':
        return (
          <div className="space-y-6">
            {tabData.getStarted.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-text">{option.title}</h3>
                <p className="text-text/60 text-sm">{option.description}</p>
                <button
                  className="w-full px-4 py-3 bg-primary text-background rounded-lg hover:opacity-90 transition-all"
                >
                  {option.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-card rounded-xl shadow-lg">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-text/60 hover:text-text transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Tabs */}
            <div className="border-b border-border">
              <nav className="flex gap-2 px-6 pt-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      activeTab === tab ? 'text-primary' : 'text-text/60 hover:text-text'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
