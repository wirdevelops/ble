'use client'

import { useState } from 'react'
import { useOnboarding } from '@/components/providers/OnboardingProvider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function PersonalInfoStep() {
  const { profile, updateProfile } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(profile.username || '')
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [phone, setPhone] = useState(profile.phone || '')

  const checkUsername = async (username: string) => {
    if (!username) return false
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (error && error.code !== 'PGRST116') {
      toast.error('Error checking username availability')
      return false
    }

    return !data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if username is available
      const isAvailable = await checkUsername(username)
      if (!isAvailable) {
        toast.error('Username is already taken')
        return
      }

      // Update profile
      await updateProfile({
        username,
        full_name: fullName,
        phone
      })

      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          phone
        })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Personal information saved!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground">
            Username
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Choose a unique username"
            />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            This will be your unique identifier in the community
          </p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
            Full Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
            Phone Number
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your phone number (optional)"
            />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            This helps verify your local presence in Bamenda
          </p>
        </div>
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
