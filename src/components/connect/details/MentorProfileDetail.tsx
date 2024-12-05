'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiUser, BiStar, BiTime, BiCalendar, BiMessageDetail, BiX } from 'react-icons/bi';
import { Mentor } from '@/types/connect';

interface MentorProfileDetailProps {
  mentor: Mentor;
  onClose: () => void;
}

export default function MentorProfileDetail({ mentor, onClose }: MentorProfileDetailProps) {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'availability', label: 'Availability' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-surface rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">Mentor Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-full transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BiUser className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-text">{mentor.name}</h3>
                  <p className="text-text/60">{mentor.role} at {mentor.company}</p>
                </div>
                <div className="flex items-center gap-1">
                  <BiStar className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{mentor.rating}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
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
                    layoutId="activeProfileTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'about' && (
              <div>
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-text/60">{mentor.bio}</p>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Professional Experience</h4>
                {mentor.experience?.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h5 className="font-medium">{exp.role}</h5>
                    <p className="text-sm text-text/60">{exp.company}</p>
                    <p className="text-sm text-text/60">{exp.duration}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Availability Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mentor.availableSlots?.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-surface-dark rounded-lg"
                    >
                      <BiCalendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{slot.day}</p>
                        <p className="text-sm text-text/60">{slot.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Mentee Reviews</h4>
                {mentor.reviews?.map((review, index) => (
                  <div key={index} className="border-b border-border last:border-0 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BiUser className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{review.mentee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BiStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text/60">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Schedule Session
            </button>
            <button className="flex items-center justify-center gap-2 px-4 border border-border rounded-lg hover:bg-surface-dark transition-colors">
              <BiMessageDetail className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
