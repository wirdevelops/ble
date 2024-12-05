'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBell, BiCheck, BiX } from 'react-icons/bi';
import { useNotifications } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import { Notification } from '@/types';

export default function NotificationCenter() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  // Only show NotificationCenter when user is authenticated
  if (!session?.user) return null;

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors"
      >
        <BiBell className="w-6 h-6 text-text" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-12 w-80 bg-surface border border-border rounded-xl shadow-2xl z-50"
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-text/60">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-border">
                <button className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return '💬';
      case 'booking':
        return '📅';
      case 'event':
        return '🎉';
      case 'system':
        return '⚙️';
      case 'recommendation':
        return '🎯';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`p-4 border-b border-border hover:bg-primary/5 transition-colors ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{getIcon()}</span>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{notification.title}</h3>
          <p className="text-sm text-text/60">{notification.message}</p>
          <div className="mt-2 text-xs text-text/40">
            {new Date(notification.createdAt).toLocaleDateString()}
          </div>
        </div>
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <BiCheck className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
