'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaImage, FaSmile } from 'react-icons/fa';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'talent';
  timestamp: string;
}

interface TalentChatProps {
  talentName: string;
  talentImage: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function TalentChat({
  talentName,
  talentImage,
  messages,
  onSendMessage,
}: TalentChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-background rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
      >
        <FaPaperPlane className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 bg-surface border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={talentImage}
                    alt={talentName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-text">{talentName}</h3>
                  <span className="text-sm text-text/60">Usually replies in 1h</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface/80 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5 text-text/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-background'
                        : 'bg-surface border border-border text-text'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-surface/80 rounded-full transition-colors">
                  <FaImage className="w-5 h-5 text-text/60" />
                </button>
                <button className="p-2 hover:bg-surface/80 rounded-full transition-colors">
                  <FaSmile className="w-5 h-5 text-text/60" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary text-background rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
