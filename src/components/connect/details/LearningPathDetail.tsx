'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiBook, BiTime, BiX, BiCheck, BiLock, BiPlay, BiDownload } from 'react-icons/bi';
import { LearningPath } from '@/types/connect';

interface LearningPathDetailProps {
  path: LearningPath;
  onClose: () => void;
}

export default function LearningPathDetail({ path, onClose }: LearningPathDetailProps) {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-surface rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">Learning Path Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-full transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Path Header */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BiBook className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-text">{path.title}</h3>
                  <p className="text-text/60">{path.description}</p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  path.level === 'beginner'
                    ? 'bg-green-100 text-green-800'
                    : path.level === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {path.level}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-text/60">
                <div className="flex items-center gap-1">
                  <BiTime className="w-4 h-4" />
                  <span>{path.duration}</span>
                </div>
                <div>
                  {path.enrolled} enrolled
                </div>
                <div className="flex gap-2">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-surface-dark rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text/60">Progress</span>
              <span className="font-medium">
                {path.modules.filter(m => m.completed).length} / {path.modules.length} modules
              </span>
            </div>
            <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${(path.modules.filter(m => m.completed).length / path.modules.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module List */}
            <div className="md:col-span-1 space-y-2">
              <h4 className="font-medium mb-4">Modules</h4>
              {path.modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeModule === index
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{module.title}</span>
                    {module.completed ? (
                      <BiCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <BiLock className="w-5 h-5 text-text/40" />
                    )}
                  </div>
                  <p className="text-sm text-text/60 mt-1">{module.duration}</p>
                </button>
              ))}
            </div>

            {/* Module Content */}
            <div className="md:col-span-2">
              <div className="bg-surface-dark rounded-xl p-6">
                <h4 className="font-medium mb-4">{path.modules[activeModule].title}</h4>
                <p className="text-text/60 mb-6">{path.modules[activeModule].description}</p>

                {/* Resources */}
                <div className="space-y-4">
                  <h5 className="font-medium">Resources</h5>
                  {path.modules[activeModule].resources?.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-surface rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {resource.type === 'video' ? (
                          <BiPlay className="w-5 h-5 text-primary" />
                        ) : (
                          <BiDownload className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-text/60">{resource.duration}</p>
                        </div>
                      </div>
                      <button className="text-primary hover:underline text-sm">
                        {resource.type === 'video' ? 'Watch' : 'Download'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Assignment */}
                {path.modules[activeModule].assignment && (
                  <div className="mt-6">
                    <h5 className="font-medium mb-2">Assignment</h5>
                    <div className="bg-surface p-4 rounded-lg">
                      <p className="text-text/60">{path.modules[activeModule].assignment}</p>
                      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        Submit Assignment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Continue Learning
            </button>
            <button className="px-4 border border-border rounded-lg hover:bg-surface-dark transition-colors">
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
