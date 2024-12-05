import FileUpload from './FileUpload'
import FileList from './FileList'

export default function FileManager() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">File Manager</h2>
        <FileUpload />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Your Files</h3>
        <FileList />
      </div>
    </div>
  )
}

export { FileUpload, FileList }
