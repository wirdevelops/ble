'use client'

import { useState, useEffect } from 'react'
import { useOnboarding } from '@/components/providers/OnboardingProvider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

// Predefined neighborhoods in Bamenda
const neighborhoods = [
  'Atuakom',
  'Azire',
  'Bayelle',
  'Commercial Avenue',
  'City Chemist',
  'Finance Junction',
  'Food Market',
  'Ghana Street',
  'Hospital Roundabout',
  'Mankon',
  'Mile 2',
  'Mile 3',
  'Mile 4',
  'Mulang',
  'Nkwen',
  'Old Town',
  'Small Mankon',
  'Up Station'
]

export default function LocationStep() {
  const { profile, updateProfile } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(profile.location || '')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (location) {
      const filtered = neighborhoods.filter(n => 
        n.toLowerCase().includes(location.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update profile
      await updateProfile({ location })

      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update({ location })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Location saved!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-foreground">
          Your Neighborhood
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            id="location"
            name="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Enter your neighborhood in Bamenda"
          />
          
          {/* Location suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background rounded-md border border-border shadow-lg">
              <ul className="py-1">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => {
                      setLocation(suggestion)
                      setSuggestions([])
                    }}
                    className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps us connect you with people and opportunities in your area
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  )
}
