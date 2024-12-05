import { useState, useEffect } from 'react'
import { FiDownload, FiTrash2, FiFile, FiImage, FiFileText, FiGrid } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface File {
  id: string
  file_name: string
  content_type: string
  size: number
  created_at: string
}

interface FileTypeIcon {
  icon: typeof FiFile
  color: string
}

const FILE_ICONS: Record<string, FileTypeIcon> = {
  'image': { icon: FiImage, color: 'text-blue-500' },
  'pdf': { icon: FiFileText, color: 'text-red-500' },
  'doc': { icon: FiFileText, color: 'text-blue-600' },
  'docx': { icon: FiFileText, color: 'text-blue-600' },
  'xls': { icon: FiGrid, color: 'text-green-600' },
  'xlsx': { icon: FiGrid, color: 'text-green-600' },
  'txt': { icon: FiFileText, color: 'text-gray-600' },
}

export default function FileList() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (!response.ok) throw new Error('Failed to fetch files')
      
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`)
      if (!response.ok) throw new Error('Failed to get download URL')

      const data = await response.json()
      if (data.success && data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download file')
    }
  }

  const deleteFiles = async () => {
    if (selectedFiles.size === 0) return

    const toastId = toast.loading('Deleting files...')
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: Array.from(selectedFiles) }),
      })

      if (!response.ok) throw new Error('Failed to delete files')

      const data = await response.json()
      if (data.success) {
        toast.success('Files deleted successfully', { id: toastId })
        setSelectedFiles(new Set())
        fetchFiles()
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete files', { id: toastId })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string, contentType: string): FileTypeIcon => {
    if (contentType.startsWith('image/')) {
      return FILE_ICONS['image']
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase()
    return FILE_ICONS[extension || ''] || { icon: FiFile, color: 'text-gray-400' }
  }

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)))
    }
  }

  const sortFiles = (files: File[]): File[] => {
    return [...files].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.file_name.localeCompare(b.file_name)
          break
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'size':
          comparison = a.size - b.size
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const sortedFiles = sortFiles(files)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSelectAll}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {selectedFiles.size === files.length ? 'Deselect All' : 'Select All'}
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded-md"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="text-gray-600 hover:text-gray-900"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            Grid
          </button>
        </div>
      </div>

      {selectedFiles.size > 0 && (
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span>{selectedFiles.size} files selected</span>
          <button
            onClick={deleteFiles}
            className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
          >
            <FiTrash2 className="mr-2" />
            Delete Selected
          </button>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="divide-y divide-gray-200">
          {sortedFiles.map((file) => {
            const { icon: FileIcon, color } = getFileIcon(file.file_name, file.content_type)
            return (
              <div
                key={file.id}
                className={`flex items-center p-4 hover:bg-gray-50 ${
                  selectedFiles.has(file.id) ? 'bg-blue-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="mr-4"
                />
                <FileIcon className={`mr-4 ${color}`} />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{file.file_name}</h3>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => downloadFile(file.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Download"
                >
                  <FiDownload />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFiles.map((file) => {
            const { icon: FileIcon, color } = getFileIcon(file.file_name, file.content_type)
            const isImage = file.content_type.startsWith('image/')
            return (
              <div
                key={file.id}
                className={`relative group p-4 border rounded-lg hover:shadow-md transition-shadow
                  ${selectedFiles.has(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="absolute top-2 left-2 z-10"
                />
                <div className="aspect-square flex items-center justify-center mb-2">
                  {isImage ? (
                    <img
                      src={`/api/files/${file.id}/preview`}
                      alt={file.file_name}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <FileIcon className={`h-12 w-12 ${color}`} />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <div className="absolute top-2 right-2 hidden group-hover:block">
                  <button
                    onClick={() => downloadFile(file.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm"
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No files uploaded yet
        </div>
      )}
    </div>
  )
}
