'use client'

import { useState } from 'react'
import { FiLock, FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface SharePageProps {
  params: {
    shareId: string
  }
}

export default function SharePage({ params }: SharePageProps) {
  const [accessCode, setAccessCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/share/${params.shareId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to download file')
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = data.url
      link.download = data.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download started')
    } catch (error) {
      console.error('Download error:', error)
      setError(error instanceof Error ? error.message : 'Failed to download file')
      toast.error('Download failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Download Shared File</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the access code if required to download the file
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="accessCode"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FiLock className="mr-2" />
              Access Code
            </label>
            <input
              type="text"
              id="accessCode"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter access code if required"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-md p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Downloading...
              </span>
            ) : (
              <span className="flex items-center">
                <FiDownload className="mr-2" />
                Download File
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
