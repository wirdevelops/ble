export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'user' | 'admin'

export type ActivityType = 'match' | 'event' | 'job'
export type ActivityStatus = 'Live' | 'Ongoing' | 'Active' | 'Upcoming' | 'Completed'

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: number
          type: ActivityType
          title: string
          status: ActivityStatus
          score: string | null
          teams: string | null
          time: string | null
          location: string | null
          participants: string | null
          company: string | null
          deadline: string | null
          applications: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          type: ActivityType
          title: string
          status: ActivityStatus
          score?: string | null
          teams?: string | null
          time?: string | null
          location?: string | null
          participants?: string | null
          company?: string | null
          deadline?: string | null
          applications?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          type?: ActivityType
          title?: string
          status?: ActivityStatus
          score?: string | null
          teams?: string | null
          time?: string | null
          location?: string | null
          participants?: string | null
          company?: string | null
          deadline?: string | null
          applications?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string | null
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          role: UserRole
          onboarding_completed: boolean
          settings: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          onboarding_completed?: boolean
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          onboarding_completed?: boolean
          settings?: Json | null
        }
      }
      files: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          size: number
          type: string
          path: string
          public_url: string | null
          metadata: Json | null
          is_favorite: boolean
          is_archived: boolean
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          size: number
          type: string
          path: string
          public_url?: string | null
          metadata?: Json | null
          is_favorite?: boolean
          is_archived?: boolean
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          size?: number
          type?: string
          path?: string
          public_url?: string | null
          metadata?: Json | null
          is_favorite?: boolean
          is_archived?: boolean
          parent_id?: string | null
        }
      }
      shares: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          file_id: string
          code: string | null
          expires_at: string | null
          max_downloads: number | null
          download_count: number
          is_active: boolean
          settings: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          file_id: string
          code?: string | null
          expires_at?: string | null
          max_downloads?: number | null
          download_count?: number
          is_active?: boolean
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          file_id?: string
          code?: string | null
          expires_at?: string | null
          max_downloads?: number | null
          download_count?: number
          is_active?: boolean
          settings?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: ActivityType
      activity_status: ActivityStatus
    }
  }
}
