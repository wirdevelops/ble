import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCalendarPlus, FaWhatsapp, FaEnvelope, FaClock } from 'react-icons/fa';
import type { Event, EventActivity } from '@/types/events';

interface EventReminderProps {
  event: Event;
  activity?: EventActivity;
}

export default function EventReminder({ event, activity }: EventReminderProps) {
  const [selectedMethod, setSelectedMethod] = useState<'push' | 'whatsapp' | 'email' | null>(null);
  const [reminderTime, setReminderTime] = useState('1h');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const title = activity ? activity.title : event.title;
  const date = activity ? activity.startDate : event.startDate;
  const time = activity ? activity.time : '00:00';

  const handleSetReminder = async () => {
    switch (selectedMethod) {
      case 'push':
        // Request notification permission and schedule push notification
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            // Schedule notification
            const eventTime = new Date(`${date}T${time}`);
            const reminderOffset = reminderTime === '1h' ? 3600000 : 
                                 reminderTime === '1d' ? 86400000 : 
                                 reminderTime === '1w' ? 604800000 : 900000;
            const reminderTime = eventTime.getTime() - reminderOffset;
            
            // For demo purposes, we'll show an immediate notification
            new Notification(`Reminder: ${title}`, {
              body: `Event starts in ${reminderTime === '1h' ? '1 hour' : 
                    reminderTime === '1d' ? '1 day' : 
                    reminderTime === '1w' ? '1 week' : '15 minutes'}`,
              icon: '/logo.png'
            });
          }
        }
        break;
      
      case 'whatsapp':
        // Open WhatsApp with pre-filled message
        const message = `Reminder for ${title} on ${new Date(date).toLocaleDateString()} at ${time}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        break;
      
      case 'email':
        // In a real app, this would call your backend API to schedule an email
        console.log('Scheduling email reminder to:', email);
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-text">Set Reminder</h3>
      </div>

      <div className="space-y-6">
        {/* Reminder Method Selection */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'push', icon: FaBell, label: 'Push' },
            { id: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp' },
            { id: 'email', icon: FaEnvelope, label: 'Email' }
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as any)}
              className={`p-4 rounded-xl border transition-colors flex flex-col items-center gap-2
                ${selectedMethod === method.id ? 
                  'border-primary bg-primary/10' : 
                  'border-border hover:border-primary/50'}`}
            >
              <method.icon className={`w-5 h-5 ${
                selectedMethod === method.id ? 'text-primary' : 'text-text/60'
              }`} />
              <span className={`text-sm ${
                selectedMethod === method.id ? 'text-primary' : 'text-text/60'
              }`}>
                {method.label}
              </span>
            </button>
          ))}
        </div>

        {/* Reminder Time Selection */}
        <div>
          <label className="text-sm text-text/60 mb-2 block">Remind me before</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: '15m', label: '15 min' },
              { value: '1h', label: '1 hour' },
              { value: '1d', label: '1 day' },
              { value: '1w', label: '1 week' }
            ].map((time) => (
              <button
                key={time.value}
                onClick={() => setReminderTime(time.value)}
                className={`p-2 rounded-lg border text-sm transition-colors
                  ${reminderTime === time.value ?
                    'border-primary bg-primary/10 text-primary' :
                    'border-border text-text/60 hover:border-primary/50'}`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Input */}
        <AnimatePresence mode="wait">
          {selectedMethod === 'whatsapp' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <label className="text-sm text-text/60 mb-2 block">WhatsApp number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237..."
                className="w-full px-4 py-2 bg-background rounded-lg text-text/80 border border-border focus:border-primary outline-none"
              />
            </motion.div>
          )}

          {selectedMethod === 'email' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <label className="text-sm text-text/60 mb-2 block">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-background rounded-lg text-text/80 border border-border focus:border-primary outline-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add to Calendar */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={() => {
              // Generate ICS file or Google Calendar link
              const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${date}/${date}&details=${encodeURIComponent(event.description)}`;
              window.open(googleCalendarUrl, '_blank');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <FaCalendarPlus />
            <span>Add to Calendar</span>
          </button>
        </div>

        {/* Set Reminder Button */}
        {selectedMethod && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSetReminder}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Set Reminder
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
