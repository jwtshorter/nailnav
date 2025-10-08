'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Camera, Trash2, Star, Eye, Edit3, Crown } from 'lucide-react'

interface Photo {
  id: string
  url: string
  filename: string
  size: number
  uploadedAt: string
  isPrimary?: boolean
  description?: string
}

interface PhotoManagerProps {
  salonId: string
  photos: Photo[]
  onPhotosChange: (photos: Photo[]) => void
  maxPhotos: number
  tierName: string
  onUpgrade?: () => void
}

export const PhotoManager = ({ 
  salonId, 
  photos, 
  onPhotosChange, 
  maxPhotos,
  tierName,
  onUpgrade 
}: PhotoManagerProps) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [editingDescription, setEditingDescription] = useState<string | null>(null)
  const [tempDescription, setTempDescription] = useState('')

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const availableSlots = maxPhotos - photos.length

    if (fileArray.length > availableSlots) {
      alert(`You can only upload ${availableSlots} more photo${availableSlots !== 1 ? 's' : ''} with your ${tierName} plan.`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = fileArray.map(async (file) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`)
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error(`${file.name} is too large (max 5MB)`)
        }

        // Create form data
        const formData = new FormData()
        formData.append('file', file)
        formData.append('salonId', salonId)

        // Upload to your API endpoint
        const response = await fetch('/api/upload/photo', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const result = await response.json()
        
        return {
          id: result.id || crypto.randomUUID(),
          url: result.url,
          filename: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          description: ''
        }
      })

      const uploadedPhotos = await Promise.all(uploadPromises)
      const newPhotos = [...photos, ...uploadedPhotos]
      
      // If this is the first photo, make it primary
      if (photos.length === 0 && uploadedPhotos.length > 0) {
        uploadedPhotos[0].isPrimary = true
      }

      onPhotosChange(newPhotos)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      // Call delete API
      await fetch(`/api/upload/photo/${photoId}`, {
        method: 'DELETE',
      })

      const updatedPhotos = photos.filter(p => p.id !== photoId)
      
      // If deleted photo was primary and there are other photos, make the first one primary
      const deletedPhoto = photos.find(p => p.id === photoId)
      if (deletedPhoto?.isPrimary && updatedPhotos.length > 0) {
        updatedPhotos[0].isPrimary = true
      }

      onPhotosChange(updatedPhotos)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete photo')
    }
  }

  const setPrimaryPhoto = (photoId: string) => {
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    }))
    onPhotosChange(updatedPhotos)
  }

  const updatePhotoDescription = (photoId: string, description: string) => {
    const updatedPhotos = photos.map(photo => 
      photo.id === photoId ? { ...photo, description } : photo
    )
    onPhotosChange(updatedPhotos)
    setEditingDescription(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const canUploadMore = photos.length < maxPhotos

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Photo Gallery</span>
            {tierName === 'featured' && <Crown className="w-4 h-4 text-yellow-500" />}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {photos.length} of {maxPhotos === Infinity ? '∞' : maxPhotos} photos used
            {tierName === 'free' && ' • Upgrade for more photos'}
          </p>
        </div>
        
        {!canUploadMore && tierName !== 'featured' && onUpgrade && (
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade Plan</span>
          </button>
        )}
      </div>

      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors ${
            dragOver
              ? 'border-primary-400 bg-primary-50'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="p-8 text-center">
            {uploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-sm text-gray-600">Uploading photos...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop photos here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB each • {maxPhotos - photos.length} slot{maxPhotos - photos.length !== 1 ? 's' : ''} remaining
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tier Limit Warning */}
      {!canUploadMore && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ImageIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800">
                Photo limit reached
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                You've reached the {maxPhotos} photo limit for your {tierName} plan.
                {tierName === 'free' && ' Upgrade to Premium (10 photos) or Featured (unlimited) for more space.'}
                {tierName === 'premium' && ' Upgrade to Featured for unlimited photos.'}
              </p>
              {tierName !== 'featured' && onUpgrade && (
                <button
                  onClick={onUpgrade}
                  className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                >
                  Upgrade now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`relative group aspect-square rounded-lg overflow-hidden ${
                  photo.isPrimary 
                    ? 'ring-2 ring-primary-500 ring-offset-2' 
                    : 'border border-gray-200'
                }`}
              >
                {/* Photo */}
                <img
                  src={photo.url}
                  alt={photo.description || photo.filename}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {photo.isPrimary && (
                  <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Primary</span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="View larger"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    {!photo.isPrimary && (
                      <button
                        onClick={() => setPrimaryPhoto(photo.id)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Set as primary photo"
                      >
                        <Star className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setEditingDescription(photo.id)
                        setTempDescription(photo.description || '')
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Edit description"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <p className="text-white text-xs truncate">
                    {photo.description || photo.filename}
                  </p>
                  <p className="text-white text-xs opacity-75">
                    {formatFileSize(photo.size)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h4>
          <p className="text-gray-600 mb-4">
            Add photos to showcase your salon and attract more customers.
          </p>
          <p className="text-sm text-gray-500">
            First photo will be your primary listing image.
          </p>
        </div>
      )}

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {selectedPhoto.description || selectedPhoto.filename}
                </h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.description || selectedPhoto.filename}
                  className="max-w-full max-h-96 mx-auto"
                />
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>Size: {formatFileSize(selectedPhoto.size)}</p>
                  <p>Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}</p>
                  {selectedPhoto.isPrimary && (
                    <p className="text-primary-600 font-medium">★ Primary photo</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description Edit Modal */}
      <AnimatePresence>
        {editingDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingDescription(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Edit Photo Description</h3>
              
              <textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                placeholder="Enter a description for this photo..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                maxLength={200}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {tempDescription.length}/200 characters
                </span>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingDescription(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updatePhotoDescription(editingDescription, tempDescription)}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotoManager