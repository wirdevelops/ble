'use client'

import { useState } from 'react'
import { useOnboarding } from '@/components/providers/OnboardingProvider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

const bioSuggestions = [
  'Share what you do for work or study',
  'Mention your role in the community',
  'Talk about your skills and expertise',
  'Share what you hope to achieve on BLE',
  'Mention your favorite spots in Bamenda'
]

export default function BioStep() {
  const { profile, updateProfile } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [bio, setBio] = useState(profile.bio || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update profile
      await updateProfile({ bio })

      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update({ bio })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Bio saved!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-foreground">
          About You
        </label>
        <div className="mt-1">
          <textarea
            id="bio"
            name="bio"
            rows={5}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Tell us about yourself..."
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {bio.length}/500 characters
        </p>
      </div>

      {/* Bio suggestions */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">
          Need inspiration? Try including:
        </h4>
        <ul className="space-y-2">
          {bioSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || !bio.trim()}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </div>
    </form>
  )
}
