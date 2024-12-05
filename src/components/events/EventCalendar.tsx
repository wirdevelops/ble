import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import type { Event } from '@/types/events';

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const weeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  return (
    <div className="bg-surface rounded-xl p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <BiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <BiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === v
                  ? 'bg-primary text-white'
                  : 'bg-background text-text hover:bg-primary/10'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border">
        {/* Weekday Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium bg-surface"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          return (
            <motion.div
              key={index}
              className={`min-h-[100px] p-2 bg-surface ${
                day ? 'hover:bg-background/50' : 'bg-background/20'
              } transition-colors`}
              whileHover={{ scale: 1.02 }}
            >
              {day && (
                <>
                  <span className="block text-sm mb-2">{day}</span>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 mb-1 rounded bg-primary/10 text-primary truncate"
                    >
                      {event.title}
                    </div>
                  ))}
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
