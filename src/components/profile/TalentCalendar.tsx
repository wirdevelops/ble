'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface TalentCalendarProps {
  availableSlots: {
    [date: string]: TimeSlot[];
  };
}

export default function TalentCalendar({ availableSlots }: TalentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const days = [...Array(daysInMonth)].map((_, i) => i + 1);
  const blanks = [...Array(firstDay)].map((_, i) => null);

  const formatDate = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.toISOString().split('T')[0];
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-surface/80 rounded-full transition-colors"
        >
          <FaChevronLeft className="w-4 h-4 text-text" />
        </button>
        <h3 className="text-lg font-semibold text-text">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-surface/80 rounded-full transition-colors"
        >
          <FaChevronRight className="w-4 h-4 text-text" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-text/60"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {[...blanks, ...days].map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} />;
          }

          const dateStr = formatDate(day);
          const hasSlots = availableSlots[dateStr]?.some(
            (slot) => slot.available
          );

          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(dateStr)}
              className={`aspect-square rounded-lg flex items-center justify-center relative ${
                selectedDate === dateStr
                  ? 'bg-primary text-background'
                  : hasSlots
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'bg-surface hover:bg-surface/80 text-text/40'
              }`}
            >
              {day}
              {hasSlots && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedDate && availableSlots[selectedDate] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 border-t border-border pt-6"
        >
          <h4 className="text-sm font-medium text-text mb-4">
            Available Time Slots
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {availableSlots[selectedDate].map((slot) => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  selectedSlot === slot.id
                    ? 'bg-primary text-background'
                    : slot.available
                    ? 'bg-surface hover:bg-surface/80 text-text'
                    : 'bg-surface/40 text-text/40 cursor-not-allowed'
                }`}
              >
                <FaClock className="w-4 h-4" />
                <span className="text-sm">
                  {slot.startTime} - {slot.endTime}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <button className="px-8 py-3 bg-primary text-background rounded-full hover:opacity-90 transition-all">
            Book This Slot
          </button>
        </motion.div>
      )}
    </div>
  );
}
