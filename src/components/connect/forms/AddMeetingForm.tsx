'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiX, BiCalendar, BiTime, BiGroup, BiLink, BiPlus } from 'react-icons/bi';

interface AddMeetingFormProps {
  onClose: () => void;
  onSubmit: (meeting: any) => void;
}

export default function AddMeetingForm({ onClose, onSubmit }: AddMeetingFormProps) {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const meeting = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      duration: formData.get('duration'),
      type: formData.get('type'),
      location: formData.get('location'),
      description: formData.get('description'),
      participants,
      meetingLink: formData.get('meetingLink'),
    };
    onSubmit(meeting);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-surface rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">Schedule New Meeting</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-full transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter meeting title"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <BiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-text mb-2">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <BiTime className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-text mb-2">
                Duration
              </label>
              <select
                id="duration"
                name="duration"
                required
                className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text mb-2">
                Meeting Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="virtual">Virtual Meeting</option>
                <option value="inPerson">In-Person Meeting</option>
                <option value="hybrid">Hybrid Meeting</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter location or meeting room"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Enter meeting description"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Participants
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                className="flex-1 px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter participant email"
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <BiPlus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-surface-dark rounded-full"
                >
                  <span className="text-sm">{participant}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <BiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Link */}
          <div>
            <label htmlFor="meetingLink" className="block text-sm font-medium text-text mb-2">
              Meeting Link
            </label>
            <div className="relative">
              <input
                type="url"
                id="meetingLink"
                name="meetingLink"
                className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                placeholder="Enter meeting link"
              />
              <BiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Schedule Meeting
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 border border-border rounded-lg hover:bg-surface-dark transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
