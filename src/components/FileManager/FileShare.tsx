import { useState } from 'react'
import { FiShare2, FiCopy, FiTrash2, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface ShareSettings {
  expiresAt?: Date
  maxDownloads?: number
  accessCode?: string
}

interface Share {
  id: string
  created_at: string
  expires_at?: string
  access_code?: string
  downloads: number
  max_downloads?: number
  url: string
}

interface FileShareProps {
  fileId: string
  fileName: string
  shares: Share[]
  onSharesChange: () => void
}

export default function FileShare({ fileId, fileName, shares, onSharesChange }: FileShareProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [settings, setSettings] = useState<ShareSettings>({})

  const createShare = async () => {
    try {
      const response = await fetch(`/api/files/${fileId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to create share')

      const data = await response.json()
      if (data.success) {
        toast.success('Share link created')
        onSharesChange()
        setIsCreating(false)
        setSettings({})
      }
    } catch (error) {
      console.error('Share creation error:', error)
      toast.error('Failed to create share link')
    }
  }

  const deleteShare = async (shareId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/share/${shareId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete share')

      const data = await response.json()
      if (data.success) {
        toast.success('Share link deleted')
        onSharesChange()
      }
    } catch (error) {
      console.error('Share deletion error:', error)
      toast.error('Failed to delete share link')
    }
  }

  const copyShareLink = async (share: Share) => {
    try {
      await navigator.clipboard.writeText(share.url)
      toast.success('Share link copied to clipboard')
    } catch (error) {
      console.error('Copy error:', error)
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Share "{fileName}"</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
        >
          <FiShare2 className="mr-2" />
          Create Share Link
        </button>
      </div>

      {isCreating && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiration</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => setSettings({ ...settings, expiresAt: e.target.value ? new Date(e.target.value) : undefined })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Downloads</label>
            <input
              type="number"
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => setSettings({ ...settings, maxDownloads: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Access Code</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Optional password protection"
              onChange={(e) => setSettings({ ...settings, accessCode: e.target.value || undefined })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={createShare}
              className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {shares.length > 0 ? (
        <div className="space-y-2">
          {shares.map((share) => (
            <div
              key={share.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {share.access_code && (
                    <FiLock className="mr-2 text-gray-400" title="Password protected" />
                  )}
                  <p className="truncate text-sm">{share.url}</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {share.downloads} downloads
                  {share.max_downloads && ` / ${share.max_downloads} max`}
                  {share.expires_at && ` • Expires ${new Date(share.expires_at).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => copyShareLink(share)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Copy link"
                >
                  <FiCopy />
                </button>
                <button
                  onClick={() => deleteShare(share.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete share"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No active share links</p>
      )}
    </div>
  )
}
