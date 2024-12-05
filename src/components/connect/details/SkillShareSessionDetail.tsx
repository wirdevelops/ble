'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BiShare,
  BiX,
  BiUser,
  BiTime,
  BiCalendar,
  BiGroup,
  BiChat,
  BiVideo,
  BiFile,
} from 'react-icons/bi';
import { SkillShareSession } from '@/types/connect';

interface SkillShareSessionDetailProps {
  session: SkillShareSession;
  onClose: () => void;
}

export default function SkillShareSessionDetail({
  session,
  onClose,
}: SkillShareSessionDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'materials', label: 'Materials' },
    { id: 'discussion', label: 'Discussion' },
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
          <h2 className="text-xl font-semibold text-text">Skill Share Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-full transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Session Header */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BiShare className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-text">{session.title}</h3>
                  <p className="text-text/60">{session.description}</p>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {session.type}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiUser className="w-4 h-4" />
                  <span>{session.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiTime className="w-4 h-4" />
                  <span>{session.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiCalendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <BiGroup className="w-4 h-4" />
                  <span>{session.enrolled}/{session.capacity} enrolled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {session.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-surface-dark rounded-full text-sm"
              >
                {skill}
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
                    layoutId="activeSessionTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div>
                <h4 className="font-medium mb-4">Session Overview</h4>
                <div className="space-y-4">
                  <div className="bg-surface-dark p-4 rounded-lg">
                    <h5 className="font-medium mb-2">What You'll Learn</h5>
                    <ul className="list-disc list-inside space-y-2 text-text/60">
                      {session.learningObjectives?.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-surface-dark p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Prerequisites</h5>
                    <ul className="list-disc list-inside space-y-2 text-text/60">
                      {session.prerequisites?.map((prerequisite, index) => (
                        <li key={index}>{prerequisite}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <h4 className="font-medium mb-4">Session Materials</h4>
                <div className="space-y-3">
                  {session.materials?.map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-surface-dark rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {material.type === 'video' ? (
                          <BiVideo className="w-5 h-5 text-primary" />
                        ) : (
                          <BiFile className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium">{material.title}</p>
                          <p className="text-sm text-text/60">{material.description}</p>
                        </div>
                      </div>
                      <button className="text-primary hover:underline text-sm">
                        {material.type === 'video' ? 'Watch' : 'Download'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div>
                <h4 className="font-medium mb-4">Discussion Forum</h4>
                <div className="space-y-4">
                  {session.discussions?.map((discussion, index) => (
                    <div key={index} className="bg-surface-dark p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BiUser className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{discussion.user}</span>
                            <span className="text-sm text-text/60">{discussion.time}</span>
                          </div>
                          <p className="text-text/60 mt-1">{discussion.message}</p>
                        </div>
                      </div>
                      {discussion.replies?.map((reply, replyIndex) => (
                        <div key={replyIndex} className="ml-11 mt-3 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <BiUser className="w-3 h-3 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{reply.user}</span>
                              <span className="text-sm text-text/60">{reply.time}</span>
                            </div>
                            <p className="text-text/60 mt-1">{reply.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* Reply Input */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BiChat className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Write a message..."
                        className="w-full p-3 bg-surface-dark rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        rows={3}
                      />
                      <button className="mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Join Session
            </button>
            <button className="px-4 border border-border rounded-lg hover:bg-surface-dark transition-colors">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
