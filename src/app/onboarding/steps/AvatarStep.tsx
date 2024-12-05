'use client'

import { useState, useRef } from 'react'
import { useOnboarding } from '@/components/providers/OnboardingProvider'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AvatarStep() {
  const { profile, updateProfile } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setLoading(true)
    try {
      const fileName = `${profile.id}-${Date.now()}-${file.name}`
      
      // Upload to Supabase Storage (you can switch this to Cloudflare R2 later)
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName)

      // Update profile
      await updateProfile({ avatar_url: publicUrl })
      setAvatarUrl(publicUrl)

      // Save to database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      if (updateError) throw updateError

      toast.success('Profile picture uploaded!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current avatar preview */}
      {avatarUrl && (
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary"
          >
            <Image
              src={avatarUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      )}

      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div>
            <button
              type="button"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:text-primary/90 font-medium"
            >
              Click to upload
            </button>
            <span className="text-muted-foreground"> or drag and drop</span>
          </div>

          <p className="text-sm text-muted-foreground">
            PNG, JPG or GIF (max. 5MB)
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={() => avatarUrl && handleFile(new File([], avatarUrl))}
          disabled={loading || !avatarUrl}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
