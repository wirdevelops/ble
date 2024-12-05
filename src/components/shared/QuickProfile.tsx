'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiUser, BiLogOut, BiCog, BiChevronDown, BiSun, BiMoon } from 'react-icons/bi';
import { useProfile, useProfileStatus } from '@/context/ProfileContext';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function QuickProfile() {
  const { data: session } = useSession();
  const { state } = useProfile();
  const { status, setStatus } = useProfileStatus();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  // Only show QuickProfile when user is authenticated
  if (!session?.user) return null;

  const statusOptions: Array<{ value: typeof status; label: string; color: string }> = [
    { value: 'online', label: 'Online', color: 'bg-green-500' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-500' },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleThemeMode = () => toggleTheme();

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
      >
        <div className="relative">
          {state.user.avatar ? (
            <img
              src={state.user.avatar}
              alt={state.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <BiUser className="w-4 h-4 text-primary" />
            </div>
          )}
          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
            statusOptions.find(s => s.value === status)?.color
          } ring-2 ring-surface`} />
        </div>
        <span className="text-sm font-medium hidden sm:block">{state.user.name}</span>
        <BiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-12 w-64 bg-surface border border-border rounded-xl shadow-2xl z-50"
          >
            {/* Profile Summary */}
            <div className="p-4 border-b border-border">
              <div className="flex items-start gap-3">
                {state.user.avatar ? (
                  <img
                    src={state.user.avatar}
                    alt={state.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <BiUser className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{state.user.name}</h3>
                  <p className="text-sm text-text/60">{state.user.role}</p>
                  {state.user.location && (
                    <p className="text-xs text-text/40 mt-1">{state.user.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="p-2 border-b border-border">
              <div className="space-y-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatus(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${
                      status === option.value ? 'bg-primary/10' : 'hover:bg-primary/5'
                    } transition-colors`}
                  >
                    <div className={`w-2 h-2 rounded-full ${option.color}`} />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-b border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{state.user.stats.totalBookings}</div>
                  <div className="text-xs text-text/60">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{state.user.stats.totalConnections}</div>
                  <div className="text-xs text-text/60">Connections</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BiUser className="w-4 h-4" />
                <span className="text-sm">View Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BiCog className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <ThemeToggle onClose={() => setIsOpen(false)} />
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors text-red-500"
                onClick={() => {
                  // TODO: Implement logout
                  setIsOpen(false);
                }}
              >
                <BiLogOut className="w-4 h-4" />
                <span className="text-sm">Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ThemeToggleProps {
  onClose: () => void;
}

function ThemeToggle({ onClose }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        onClose();
      }}
    >
      {theme === 'light' ? (
        <BiMoon className="w-4 h-4" />
      ) : (
        <BiSun className="w-4 h-4" />
      )}
      <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
}
