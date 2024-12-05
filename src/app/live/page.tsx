'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaComments, FaUsers, FaShare, FaCamera } from 'react-icons/fa';

// Mock data - Replace with real-time data from your backend
const mockCameraAngles = [
  { id: 1, name: 'Main Camera', type: 'video' },
  { id: 2, name: 'Side View', type: 'video' },
  { id: 3, name: 'Close-up', type: 'video' },
];

const mockUpdates = [
  { id: 1, time: '90:00', text: 'Full time! Final score: Team A 2 - 1 Team B' },
  { id: 2, time: '89:00', text: 'Yellow card shown to Player X for time wasting' },
  { id: 3, time: '85:00', text: 'Substitution for Team A: Player Y comes on for Player Z' },
];

export default function LivePage() {
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [viewerCount, setViewerCount] = useState(0);
  const [updates, setUpdates] = useState(mockUpdates);

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.floor(Math.random() * 1000 + 500));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stream Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-text">
                Football Tournament Finals
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaUsers className="text-primary mr-2" />
                  <span className="text-text">{viewerCount} watching</span>
                </div>
                <button className="p-2 rounded-full hover:bg-surface">
                  <FaShare className="text-primary" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-surface rounded-lg border border-border relative">
              {/* Replace with actual video player component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <FaVideo className="w-16 h-16 text-text/20" />
              </div>
            </div>

            {/* Camera Angles */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {mockCameraAngles.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera.id)}
                  className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                    selectedCamera === camera.id
                      ? 'bg-primary text-background'
                      : 'bg-surface text-text hover:bg-surface/80'
                  }`}
                >
                  <FaCamera className="mr-2" />
                  {camera.name}
                </button>
              ))}
            </div>
          </div>

          {/* Live Updates */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Live Updates</h2>
              <div className="flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-medium text-red-500">LIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              {updates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-border pb-4 last:border-0"
                >
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-primary min-w-[50px]">
                      {update.time}
                    </span>
                    <p className="text-text">{update.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat/Comments Section */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <FaComments className="text-primary mr-2" />
                <h3 className="text-lg font-medium text-text">Live Chat</h3>
              </div>
              <div className="bg-background/50 rounded p-4 h-[200px] overflow-y-auto mb-4">
                {/* Add chat messages here */}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-text"
                />
                <button className="px-4 py-2 bg-primary text-background rounded-lg hover:opacity-90">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
