'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiPlus } from 'react-icons/bi';
import SearchBar from './search/SearchBar';
import AddContactForm from './forms/AddContactForm';
import { useSearch } from '@/hooks/useSearch';
import { useSocketStore } from '@/lib/socket';

interface ConnectLayoutProps {
  children: React.ReactNode;
  items: any[];
}

export default function ConnectLayout({ children, items }: ConnectLayoutProps) {
  const [showAddContact, setShowAddContact] = useState(false);
  const { filteredItems, handleSearch, handleFilter } = useSearch(items);
  const socket = useSocketStore((state) => state.socket);

  const handleAddContact = async (contact: any) => {
    try {
      // Emit socket event for real-time updates
      socket?.emit('contact:add', contact);
      
      // Close the form
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Connect</h1>
            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <BiPlus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>
          </div>
          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddContact && (
          <AddContactForm
            onClose={() => setShowAddContact(false)}
            onSubmit={handleAddContact}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
