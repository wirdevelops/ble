'use client'

import { useState } from 'react'
import { useOnboarding } from '@/components/providers/OnboardingProvider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Predefined interests with icons and categories
const interestCategories = [
  {
    name: 'Business',
    interests: [
      'Trading',
      'Small Business',
      'Agriculture',
      'Real Estate',
      'Technology',
      'Services'
    ]
  },
  {
    name: 'Community',
    interests: [
      'Local Events',
      'Education',
      'Healthcare',
      'Sports',
      'Arts & Culture',
      'Volunteering'
    ]
  },
  {
    name: 'Skills',
    interests: [
      'Crafts',
      'Cooking',
      'Music',
      'Teaching',
      'Digital Skills',
      'Languages'
    ]
  }
]

export default function InterestsStep() {
  const { profile, updateProfile } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.interests || []
  )
  const [customInterest, setCustomInterest] = useState('')

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault()
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests(prev => [...prev, customInterest.trim()])
      setCustomInterest('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update profile
      await updateProfile({ interests: selectedInterests })

      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update({ interests: selectedInterests })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Interests saved!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected interests tags */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <motion.span
              key={interest}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
            >
              {interest}
              <button
                type="button"
                onClick={() => toggleInterest(interest)}
                className="ml-2 focus:outline-none"
              >
                ×
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Interest categories */}
      <div className="space-y-4">
        {interestCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {category.interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    selectedInterests.includes(interest)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom interest input */}
      <div>
        <label htmlFor="customInterest" className="block text-sm font-medium text-foreground">
          Add Custom Interest
        </label>
        <div className="mt-1 flex">
          <input
            type="text"
            id="customInterest"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            className="block flex-1 rounded-l-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Enter a custom interest"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="px-4 rounded-r-md border border-l-0 border-border bg-muted hover:bg-muted/80"
          >
            Add
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || selectedInterests.length === 0}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
        {selectedInterests.length === 0 && (
          <p className="mt-2 text-sm text-red-500">
            Please select at least one interest
          </p>
        )}
      </div>
    </form>
  )
}
