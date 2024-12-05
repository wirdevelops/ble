'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BiHome, BiSearch, BiCompass, BiTrendingUp, BiCalendarEvent, BiMessageSquareDetail } from 'react-icons/bi';
import { FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/context/AppContext';

const navItems = [
  { 
    href: '/', 
    label: 'Home',
    icon: BiHome,
    badge: false
  },
  { 
    href: '/discover', 
    label: 'Discover',
    icon: BiSearch,
    badge: false
  },
  { 
    href: '/trending', 
    label: 'Trending',
    icon: FiTrendingUp,
    badge: true,
    badgeColor: 'bg-primary',
    badgeCount: 5
  },
  { 
    href: '/events', 
    label: 'Events',
    icon: BiCalendarEvent,
    badge: true,
    badgeColor: 'bg-primary',
    badgeCount: 3
  },
  { 
    href: '/connect', 
    label: 'Connect',
    icon: BiMessageSquareDetail,
    badge: true,
    badgeColor: 'bg-primary',
    badgeCount: 2
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  const handleTabClick = (href: string) => {
    if (href === '/discover') {
      openSearch();
      return false; // Prevent default navigation
    }
    return true; // Allow default navigation
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-background/30 backdrop-blur-xl border-t border-border/50">
        <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-4">
          {navItems.map(({ href, label, icon: Icon, badge, badgeColor, badgeCount }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  if (!handleTabClick(href)) {
                    e.preventDefault();
                  }
                }}
                className={`relative flex flex-col items-center justify-center min-w-[76px] p-2
                  transition-all duration-300 ease-out group`}
              >
                <div className="relative">
                  <motion.div
                    className={`relative p-3 rounded-2xl transition-all duration-300
                      ${isActive ? 'bg-primary' : 'hover:bg-primary/10'}`}
                    whileHover={{ scale: 1.05 }}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon 
                      className={`h-6 w-6 transition-all duration-300
                        ${isActive 
                          ? 'text-black'
                          : 'text-text/60 group-hover:text-text/80'
                        }`}
                    />
                    
                    {badge && badgeCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className={`absolute -top-1 -right-1 ${badgeColor}
                          min-w-[20px] h-[20px] rounded-full flex items-center justify-center
                          text-[11px] font-semibold text-white shadow-lg
                          border border-background/50`}
                      >
                        {badgeCount}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                <motion.span 
                  className={`text-xs mt-2 font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-primary'
                      : 'text-text/60 group-hover:text-text/80'}`}
                  initial={false}
                  animate={{ y: isActive ? -2 : 0 }}
                >
                  {label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Blur Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent -z-10 pointer-events-none" />
    </nav>
  );
}