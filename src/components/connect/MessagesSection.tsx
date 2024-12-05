'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BiMessageSquareDetail,
  BiUser,
  BiTime,
  BiCheck,
  BiCheckDouble,
  BiSend,
  BiSmile,
  BiImage,
  BiFile,
  BiMicrophone,
} from 'react-icons/bi';

// Types
interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  typing?: boolean;
  unreadCount: number;
}

// Mock Data
const contacts: Contact[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online',
    unreadCount: 3,
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'away',
    lastSeen: '5m ago',
    unreadCount: 0,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'offline',
    lastSeen: '2h ago',
    unreadCount: 1,
  },
];

const messageHistory: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 1,
      content: 'Hi! How are you doing?',
      timestamp: '10:30 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: 2,
      senderId: 0, // current user
      content: "Hey Sarah! I'm doing great, thanks for asking. How about you?",
      timestamp: '10:31 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: 3,
      senderId: 1,
      content: 'I\'m good too! Just wanted to discuss the upcoming project.',
      timestamp: '10:32 AM',
      status: 'read',
      type: 'text',
    },
  ],
};

interface MessagesSectionProps {
  searchQuery: string;
}

export default function MessagesSection({ searchQuery }: MessagesSectionProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    if (searchQuery) {
      setFilteredContacts(
        contacts.filter((contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedContact) {
      setMessages(messageHistory[selectedContact.id] || []);
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: messages.length + 1,
      senderId: 0, // current user
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate message being delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    // Simulate message being read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMsg.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);
  };

  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    switch (status) {
      case 'sent':
        return <BiCheck className="w-4 h-4 text-text/60" />;
      case 'delivered':
        return <BiCheckDouble className="w-4 h-4 text-text/60" />;
      case 'read':
        return <BiCheckDouble className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden h-[calc(100vh-16rem)]">
      <div className="flex h-full">
        {/* Contacts List */}
        <div className="w-80 border-r border-border">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-text mb-4">Messages</h2>
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <motion.button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-primary/10'
                      : 'hover:bg-surface-hover'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                        contact.status === 'online'
                          ? 'bg-green-500'
                          : contact.status === 'away'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-text">{contact.name}</h3>
                    <p className="text-sm text-text/60">
                      {contact.status === 'online'
                        ? 'Online'
                        : `Last seen ${contact.lastSeen}`}
                    </p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                      {contact.unreadCount}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-text">{selectedContact.name}</h3>
                    <p className="text-sm text-text/60">
                      {selectedContact.status === 'online'
                        ? 'Online'
                        : `Last seen ${selectedContact.lastSeen}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 0 ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 0
                          ? 'bg-primary text-white'
                          : 'bg-surface-hover text-text'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-80">{message.timestamp}</span>
                        {message.senderId === 0 && (
                          <MessageStatus status={message.status} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-text/60 hover:text-text">
                    <BiSmile className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-text/60 hover:text-text">
                    <BiImage className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-text/60 hover:text-text">
                    <BiFile className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-surface-hover rounded-lg px-4 py-2 focus:outline-none"
                  />
                  <button className="p-2 text-text/60 hover:text-text">
                    <BiMicrophone className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <BiSend className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text/60">
              <div className="text-center">
                <BiMessageSquareDetail className="w-16 h-16 mx-auto mb-4" />
                <p>Select a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
