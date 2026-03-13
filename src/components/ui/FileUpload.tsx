'use client'

import { useCallback, useState, useRef } from 'react'
import { cn } from '@/lib/cn'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { MAX_FILE_SIZE, MAX_FILES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: string[]
  className?: string
}

export function FileUpload({
  onFilesChange,
  maxFiles = MAX_FILES,
  maxSize = MAX_FILE_SIZE,
  accept = ACCEPTED_IMAGE_TYPES,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndAddFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null)
      const fileArray = Array.from(newFiles)

      if (files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      for (const file of fileArray) {
        if (!accept.includes(file.type)) {
          setError('Invalid file type. Please use JPEG, PNG, or HEIC.')
          return
        }
        if (file.size > maxSize) {
          setError(`File "${file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`)
          return
        }
      }

      const updatedFiles = [...files, ...fileArray]
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)

      // Generate previews
      fileArray.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    },
    [files, maxFiles, maxSize, accept, onFilesChange]
  )

  const removeFile = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index)
      const updatedPreviews = previews.filter((_, i) => i !== index)
      setFiles(updatedFiles)
      setPreviews(updatedPreviews)
      onFilesChange(updatedFiles)
      setError(null)
    },
    [files, previews, onFilesChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files) {
        validateAndAddFiles(e.dataTransfer.files)
      }
    },
    [validateAndAddFiles]
  )

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 cursor-pointer transition-colors',
          dragOver
            ? 'border-accent bg-blue-50/50'
            : 'border-border hover:border-fg-muted',
          files.length >= maxFiles && 'opacity-50 pointer-events-none'
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      >
        <Upload className="h-6 w-6 text-fg-muted" />
        <p className="text-sm text-fg-secondary">
          Drag & drop or <span className="text-accent font-medium">browse</span>
        </p>
        <p className="text-xs text-fg-muted">
          JPEG, PNG, or HEIC up to {maxSize / 1024 / 1024}MB ({files.length}/{maxFiles})
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          multiple
          onChange={(e) => e.target.files && validateAndAddFiles(e.target.files)}
          className="sr-only"
          aria-hidden="true"
        />
      </div>

      {error && (
        <p className="text-sm text-error" role="alert">{error}</p>
      )}

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative group">
              <div className="h-16 w-16 rounded-md overflow-hidden border border-border">
                {preview.startsWith('data:image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt={files[i]?.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-bg-surface-2">
                    <ImageIcon className="h-6 w-6 text-fg-muted" />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="absolute -top-1.5 -right-1.5 rounded-full bg-fg-primary p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${files[i]?.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
