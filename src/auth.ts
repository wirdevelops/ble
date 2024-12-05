import { createClient, createServerComponentClient } from './lib/supabase'
import { cookies } from 'next/headers'

// Helper function to get server session
export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies })
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Helper function to get server user
export async function getServerUser() {
  const supabase = createServerComponentClient({ cookies })
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Helper function to get client
export function getClient() {
  return createClient()
}

// Client-side Supabase instance
export const createClientClient = () => {
  return createClient()
}

export * from './lib/supabase/client'
export * from './lib/supabase/server'
