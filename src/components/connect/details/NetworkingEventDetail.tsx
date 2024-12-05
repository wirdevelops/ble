'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BiCalendar,
  BiX,
  BiTime,
  BiMap,
  BiGroup,
  BiUser,
  BiMicrophone,
  BiLink,
  BiShare,
} from 'react-icons/bi';
import { NetworkingEvent } from '@/types/connect';

interface NetworkingEventDetailProps {
  event: NetworkingEvent;
  onClose: () => void;
}

export default function NetworkingEventDetail({
  event,
  onClose,
}: NetworkingEventDetailProps) {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Event Details' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'attendees', label: 'Attendees' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-surface rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">Networking Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-full transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Event Header */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BiCalendar className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-text">{event.title}</h3>
                  <p className="text-text/60">{event.description}</p>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {event.type}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiCalendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiTime className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiMap className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiGroup className="w-4 h-4" />
                  <span>{event.attendees}/{event.maxCapacity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-6">
            {event.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-surface-dark rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-primary' : 'text-text/60 hover:text-text'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeEventTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Event Schedule</h4>
                  <div className="space-y-3">
                    {event.schedule?.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 bg-surface-dark rounded-lg"
                      >
                        <div className="text-sm text-primary font-medium w-24 flex-shrink-0">
                          {item.time}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-text/60">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Event Links</h4>
                  <div className="space-y-3">
                    {event.links?.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-surface-dark rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <BiLink className="w-5 h-5 text-primary" />
                          <span>{link.title}</span>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Open Link
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="p-4 bg-surface-dark rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <BiMicrophone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-medium">{speaker}</h5>
                        <p className="text-sm text-text/60">Speaker</p>
                      </div>
                    </div>
                    <button className="w-full mt-2 text-primary hover:underline text-sm">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'attendees' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Registered Attendees</h4>
                  <span className="text-sm text-text/60">
                    {event.attendees} of {event.maxCapacity} spots filled
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.attendeeList?.map((attendee, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-surface-dark rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BiUser className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{attendee.name}</p>
                        <p className="text-sm text-text/60">{attendee.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Register Now
            </button>
            <button className="flex items-center justify-center gap-2 px-4 border border-border rounded-lg hover:bg-surface-dark transition-colors">
              <BiShare className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
