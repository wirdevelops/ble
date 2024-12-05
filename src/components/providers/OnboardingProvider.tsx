import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { uploadToR2 } from '@/lib/upload'
import { toast } from 'react-hot-toast'

type Profile = {
  id: string
  email?: string
  full_name?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  role?: string
  onboarding_completed?: boolean
  created_at?: string
  updated_at?: string
}

export type OnboardingStep = {
  id: string
  title: string
  description: string
  fields: (keyof Profile)[]
  isValid: (data: Partial<Profile>) => boolean
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Let\'s get to know you better',
    fields: ['full_name', 'display_name'],
    isValid: (data) => !!(data.full_name && data.display_name)
  },
  {
    id: 'avatar',
    title: 'Profile Picture',
    description: 'Add a profile picture to personalize your account',
    fields: ['avatar_url'],
    isValid: (data) => true // Avatar is optional
  },
  {
    id: 'bio',
    title: 'About You',
    description: 'Tell us a bit about yourself',
    fields: ['bio'],
    isValid: (data) => !!(data.bio && data.bio.length >= 10)
  }
]

interface OnboardingContextType {
  currentStep: number
  totalSteps: number
  profile: Partial<Profile>
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  isLastStep: boolean
  currentStepData: OnboardingStep
  updateProfile: (data: Partial<Profile>) => Promise<void>
  handleFileUpload: (file: File) => Promise<string>
  isCurrentStepValid: boolean
  completeOnboarding: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({
  children,
  initialProfile = {}
}: {
  children: React.ReactNode
  initialProfile?: Partial<Profile>
}) {
  const { user, updateUserProfile, updateOnboardingStatus } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<Partial<Profile>>({
    ...initialProfile,
    id: user?.id,
    email: user?.email,
  })

  const currentStepData = onboardingSteps[currentStep]
  const isCurrentStepValid = currentStepData.isValid(profile)

  const nextStep = useCallback(() => {
    if (currentStep < onboardingSteps.length - 1 && isCurrentStepValid) {
      setCurrentStep(step => step + 1)
    }
  }, [currentStep, isCurrentStepValid])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < onboardingSteps.length) {
      setCurrentStep(step)
    }
  }, [])

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      // Upload to R2
      const { url } = await uploadToR2(file, {
        directory: `avatars/${user?.id}`,
        maxSizeMB: 1,
      })

      return url
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      throw error
    }
  }

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    try {
      const updatedProfile = { ...profile, ...data }
      setProfile(updatedProfile)

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedProfile.full_name,
          display_name: updatedProfile.display_name,
          avatar_url: updatedProfile.avatar_url,
          bio: updatedProfile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error

      await updateUserProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }, [profile, user?.id, updateUserProfile])

  const completeOnboarding = async () => {
    try {
      if (!isCurrentStepValid) {
        toast.error('Please complete all required fields')
        return
      }

      await updateOnboardingStatus(true)
      toast.success('Welcome! Your profile is now complete.')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Failed to complete profile setup')
      throw error
    }
  }

  const value = {
    currentStep,
    totalSteps: onboardingSteps.length,
    profile,
    nextStep,
    prevStep,
    goToStep,
    isLastStep: currentStep === onboardingSteps.length - 1,
    currentStepData,
    updateProfile,
    handleFileUpload,
    isCurrentStepValid,
    completeOnboarding,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
