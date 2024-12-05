'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BiUser,
  BiBuildings,
  BiMap,
  BiLink,
  BiPlus,
  BiMessageSquareDetail,
  BiDotsHorizontalRounded,
  BiFilter,
  BiSearch,
} from 'react-icons/bi';

// Types
interface Connection {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  mutualConnections: number;
  skills: string[];
  status: 'connected' | 'pending' | null;
  online: boolean;
  lastActive?: string;
}

interface SuggestedConnection extends Connection {
  connectionReason: string;
}

// Mock Data
const connections: Connection[] = [
  {
    id: 1,
    name: 'Sarah Miller',
    title: 'Senior UX Designer',
    company: 'Design Co.',
    location: 'San Francisco, CA',
    avatar: 'https://i.pravatar.cc/150?img=1',
    mutualConnections: 12,
    skills: ['UI/UX', 'Product Design', 'Figma'],
    status: 'connected',
    online: true,
  },
  {
    id: 2,
    name: 'John Davis',
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'New York, NY',
    avatar: 'https://i.pravatar.cc/150?img=2',
    mutualConnections: 8,
    skills: ['React', 'Node.js', 'TypeScript'],
    status: 'connected',
    online: false,
    lastActive: '2h ago',
  },
];

const suggestedConnections: SuggestedConnection[] = [
  {
    id: 3,
    name: 'Emma Wilson',
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'London, UK',
    avatar: 'https://i.pravatar.cc/150?img=3',
    mutualConnections: 15,
    skills: ['Product Strategy', 'Agile', 'Leadership'],
    status: null,
    online: true,
    connectionReason: 'Based on your profile and interests',
  },
  {
    id: 4,
    name: 'Michael Chen',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Toronto, CA',
    avatar: 'https://i.pravatar.cc/150?img=4',
    mutualConnections: 6,
    skills: ['React', 'Vue.js', 'CSS'],
    status: null,
    online: false,
    lastActive: '1d ago',
    connectionReason: 'You may know from Tech Corp',
  },
];

interface NetworkingSectionProps {
  searchQuery: string;
}

export default function NetworkingSection({ searchQuery }: NetworkingSectionProps) {
  const [activeTab, setActiveTab] = useState<'connections' | 'suggestions'>('connections');
  const [filteredConnections, setFilteredConnections] = useState(connections);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestedConnections);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredConnections(
        connections.filter(
          (connection) =>
            connection.name.toLowerCase().includes(query) ||
            connection.title.toLowerCase().includes(query) ||
            connection.company.toLowerCase().includes(query)
        )
      );
      setFilteredSuggestions(
        suggestedConnections.filter(
          (connection) =>
            connection.name.toLowerCase().includes(query) ||
            connection.title.toLowerCase().includes(query) ||
            connection.company.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredConnections(connections);
      setFilteredSuggestions(suggestedConnections);
    }
  }, [searchQuery]);

  const ConnectionCard = ({ connection }: { connection: Connection }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={connection.avatar}
            alt={connection.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {connection.online ? (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface" />
          ) : (
            connection.lastActive && (
              <div className="absolute -bottom-1 right-0 bg-surface text-xs px-2 py-0.5 rounded-full border border-border">
                {connection.lastActive}
              </div>
            )
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-text">{connection.name}</h3>
              <p className="text-sm text-text/60">{connection.title}</p>
            </div>
            <button className="p-1.5 text-text/60 hover:text-text rounded-lg hover:bg-surface-hover">
              <BiDotsHorizontalRounded className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm text-text/60">
              <BiBuildings className="w-4 h-4" />
              <span>{connection.company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text/60">
              <BiMap className="w-4 h-4" />
              <span>{connection.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text/60">
              <BiLink className="w-4 h-4" />
              <span>{connection.mutualConnections} mutual connections</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {connection.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <BiMessageSquareDetail className="w-5 h-5" />
            </button>
            {connection.status === 'connected' ? (
              <button className="flex-1 px-4 py-2 border border-border text-text hover:border-primary rounded-lg transition-colors">
                Connected
              </button>
            ) : connection.status === 'pending' ? (
              <button className="flex-1 px-4 py-2 border border-border text-text/60 rounded-lg cursor-not-allowed">
                Pending
              </button>
            ) : (
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <BiPlus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Filters and Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('connections')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'connections'
                ? 'border-primary text-primary'
                : 'border-transparent text-text/60 hover:text-text'
            }`}
          >
            My Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-primary text-primary'
                : 'border-transparent text-text/60 hover:text-text'
            }`}
          >
            Suggestions ({suggestedConnections.length})
          </button>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:border-primary transition-colors"
        >
          <BiFilter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface p-4 rounded-xl border border-border"
          >
            {/* Add filter options here */}
            <p className="text-text/60">Filter options coming soon...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === 'connections'
          ? filteredConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))
          : filteredSuggestions.map((connection) => (
              <motion.div key={connection.id} className="relative">
                <ConnectionCard connection={connection} />
                <div className="mt-2 text-sm text-text/60">
                  <BiUser className="w-4 h-4 inline-block mr-1" />
                  {connection.connectionReason}
                </div>
              </motion.div>
            ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'connections' && filteredConnections.length === 0) ||
        (activeTab === 'suggestions' && filteredSuggestions.length === 0)) && (
        <div className="text-center py-12">
          <BiUser className="w-16 h-16 mx-auto mb-4 text-text/40" />
          <h3 className="text-lg font-medium text-text mb-2">No results found</h3>
          <p className="text-text/60">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
