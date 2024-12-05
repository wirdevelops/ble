import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import imageCompression from 'browser-image-compression'

// File type configurations
const ACCEPTED_FILE_TYPES = {
  // Images
  'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'],
  
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  
  // Text and code
  'text/plain': ['.txt'],
  'text/html': ['.html', '.htm'],
  'text/css': ['.css'],
  'text/javascript': ['.js'],
  'application/json': ['.json'],
  'text/markdown': ['.md'],
  
  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  
  // Audio
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  
  // Video
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/webm': ['.webm'],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_FILES = 10
const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

interface UploadingFile {
  file: File
  progress: number
  error?: string
  compressing?: boolean
}

export default function FileUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`
    }
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const compressImageIfNeeded = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.size <= 1024 * 1024) {
      return file
    }

    try {
      const compressedBlob = await imageCompression(file, IMAGE_COMPRESSION_OPTIONS)
      return new File([compressedBlob], file.name, { type: file.type })
    } catch (error) {
      console.warn('Image compression failed:', error)
      return file
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    if (acceptedFiles.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files can be uploaded at once`)
      return
    }

    // Validate files
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of acceptedFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    setIsUploading(true)
    setUploadingFiles(validFiles.map(file => ({ file, progress: 0, compressing: file.type.startsWith('image/') })))

    try {
      for (let i = 0; i < validFiles.length; i++) {
        let file = validFiles[i]
        
        // Compress image if needed
        if (file.type.startsWith('image/')) {
          file = await compressImageIfNeeded(file)
          setUploadingFiles(prev => 
            prev.map((uf, index) => 
              index === i ? { ...uf, compressing: false } : uf
            )
          )
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Upload failed')
          }

          const data = await response.json()
          if (!data.success) {
            throw new Error(data.error || 'Upload failed')
          }

          setUploadingFiles(prev => 
            prev.map((uf, index) => 
              index === i ? { ...uf, progress: 100 } : uf
            )
          )
        } catch (error) {
          setUploadingFiles(prev => 
            prev.map((uf, index) => 
              index === i ? { ...uf, error: 'Failed to upload' } : uf
            )
          )
        }
      }

      // Clear successful uploads after a delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(uf => uf.error))
      }, 3000)

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    maxFiles: MAX_FILES,
    disabled: isUploading,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Maximum {MAX_FILES} files, up to {formatFileSize(MAX_FILE_SIZE)} each
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: Images, Documents, Archives, Audio, Video
        </p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uf, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg bg-gray-50 
                ${uf.error ? 'border-red-200' : 'border-gray-200'}`}
            >
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{uf.file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      uf.error ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${uf.progress}%` }}
                  />
                </div>
                {uf.compressing && (
                  <p className="mt-1 text-xs text-gray-500">Compressing image...</p>
                )}
                {uf.error && (
                  <p className="mt-1 text-xs text-red-500">{uf.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
