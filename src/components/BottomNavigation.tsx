'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BiHome, BiCompass, BiCalendarEvent, BiGroup } from 'react-icons/bi';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home', icon: BiHome },
  { href: '/explore', label: 'Explore', icon: BiCompass },
  { href: '/events', label: 'Events', icon: BiCalendarEvent },
  { href: '/community', label: 'Community', icon: BiGroup },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center flex-1 min-w-0 text-sm font-medium transition-colors"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="bottomNav"
                    className="absolute inset-0 -m-2 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  className={`h-6 w-6 mb-1 transition-colors ${
                    isActive ? 'text-primary' : 'text-text hover:text-primary'
                  }`}
                />
              </div>
              <span 
                className={`truncate transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-text/60'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
