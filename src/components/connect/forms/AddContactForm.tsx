'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BiX,
  BiUser,
  BiEnvelope,
  BiPhone,
  BiBuilding,
  BiGlobe,
  BiLink,
  BiPlus,
} from 'react-icons/bi';
import { useSocketStore, useRealTimeEvents, useRealTimeUpdates } from '@/lib/socket';

interface AddContactFormProps {
  onClose: () => void;
  onSubmit: (contact: any) => void;
}

export default function AddContactForm({ onClose, onSubmit }: AddContactFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [collaborators, setCollaborators] = useState<Array<{ id: string; name: string; cursor: string }>>([]);
  const socket = useSocketStore((state) => state.socket);
  const { subscribeToContact, unsubscribeFromContact } = useRealTimeUpdates('userId');

  // Set up real-time collaboration
  useEffect(() => {
    if (!socket) return;

    // Subscribe to form collaboration
    socket.emit('form:join', { formId: 'add-contact' });

    // Handle collaborator updates
    socket.on('collaborator:update', (updatedCollaborators) => {
      setCollaborators(updatedCollaborators);
    });

    // Handle form field updates
    socket.on('form:field-update', ({ field, value }) => {
      const formElement = document.getElementById(field) as HTMLInputElement;
      if (formElement && document.activeElement !== formElement) {
        formElement.value = value;
      }
    });

    return () => {
      socket.emit('form:leave', { formId: 'add-contact' });
      socket.off('collaborator:update');
      socket.off('form:field-update');
    };
  }, [socket]);

  // Emit field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!socket) return;
    socket.emit('form:field-change', {
      formId: 'add-contact',
      field: e.target.id,
      value: e.target.value,
    });
  };

  // Handle cursor position updates
  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!socket) return;
    socket.emit('cursor:update', {
      formId: 'add-contact',
      field: e.target.id,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const contact = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      role: formData.get('role'),
      website: formData.get('website'),
      linkedin: formData.get('linkedin'),
      tags,
      notes: formData.get('notes'),
    };
    onSubmit(contact);
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
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-text">Add New Contact</h2>
            <div className="flex -space-x-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="relative"
                  title={`${collaborator.name} - ${collaborator.cursor}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                    {collaborator.name.charAt(0)}
                  </div>
                  {collaborator.cursor && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-full transition-colors"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text mb-2">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter first name"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text mb-2">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter last name"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text mb-2">
                Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter phone number"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-text mb-2">
                Company
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter company name"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text mb-2">
                Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter job title"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-text mb-2">
                Website
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter website URL"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-text mb-2">
                LinkedIn
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  className="w-full px-4 py-2 pl-10 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter LinkedIn profile URL"
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                />
                <BiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  handleFieldChange(e);
                }}
                onFocus={handleFieldFocus}
                className="flex-1 px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add tags (e.g., client, vendor, partner)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <BiPlus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-surface-dark rounded-full"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <BiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Add any additional notes about the contact"
              onChange={handleFieldChange}
              onFocus={handleFieldFocus}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Contact
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
