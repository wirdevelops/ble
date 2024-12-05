'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { BiBell, BiHome, BiSearch, BiCalendarEvent, BiMessageSquare, BiUser } from 'react-icons/bi';
import LiveIndicator from './LiveIndicator';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount] = useState(3); // This would come from your notification system
  const pathname = usePathname();

  return (
    <nav className="fixed w-full z-50 bg-background/60 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary">
            BLE
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Live Indicator */}
            <Link href="/live" className="flex items-center">
              <LiveIndicator />
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-surface transition-colors">
                <BiBell className="h-6 w-6 text-text hover:text-primary transition-colors" />
                {notificationCount > 0 && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-background">{notificationCount}</span>
                  </div>
                )}
              </button>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-surface transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src="/avatars/default.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border"
                  >
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-surface"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FiUser className="mr-3 h-5 w-5" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-surface"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          // Add logout logic here
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/60 backdrop-blur-lg border-t border-border z-50">
        <div className="max-w-md mx-auto px-6 h-16">
          <div className="flex justify-between items-center h-full">
            <Link 
              href="/" 
              className={`flex flex-col items-center space-y-1 ${
                pathname === '/' ? 'text-primary' : 'text-text/60'
              }`}
            >
              <BiHome className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </Link>
            
            <Link 
              href="/discover" 
              className={`flex flex-col items-center space-y-1 ${
                pathname === '/discover' ? 'text-primary' : 'text-text/60'
              }`}
            >
              <BiSearch className="h-6 w-6" />
              <span className="text-xs">Discover</span>
            </Link>
            
            <Link 
              href="/events" 
              className={`flex flex-col items-center space-y-1 ${
                pathname === '/events' ? 'text-primary' : 'text-text/60'
              }`}
            >
              <BiCalendarEvent className="h-6 w-6" />
              <span className="text-xs">Events</span>
            </Link>
            
            <Link 
              href="/messages" 
              className={`flex flex-col items-center space-y-1 ${
                pathname === '/messages' ? 'text-primary' : 'text-text/60'
              }`}
            >
              <BiMessageSquare className="h-6 w-6" />
              <span className="text-xs">Messages</span>
            </Link>
            
            <Link 
              href="/profile" 
              className={`flex flex-col items-center space-y-1 ${
                pathname === '/profile' ? 'text-primary' : 'text-text/60'
              }`}
            >
              <BiUser className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;