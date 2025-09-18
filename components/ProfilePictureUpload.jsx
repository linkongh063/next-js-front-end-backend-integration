"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Upload, 
  Trash2, 
  Camera, 
  Loader2,
  AlertCircle,
  X
} from "lucide-react";

export default function ProfilePictureUpload({ 
  currentImage, 
  customerName, 
  customerId, 
  onImageUpdate,
  onError 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setUploadError('File size too large. Maximum size is 2MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload the file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/user-upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const uploadResult = await uploadResponse.json();

      // Delete old image if it exists
      if (currentImage) {
        try {
          await fetch(`/api/user-upload?imageUrl=${encodeURIComponent(currentImage)}`, {
            method: 'DELETE',
          });
        } catch (error) {
          console.warn('Failed to delete old image:', error);
        }
      }

      // Update user profile picture in database
      const updateResponse = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: customerId,
          profilePicture: uploadResult.url,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update profile picture');
      }

      // Notify parent component
      onImageUpdate(uploadResult.url);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload profile picture');
      onError?.(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImage) return;

    setIsDeleting(true);
    setUploadError(null);

    try {
      // Delete from file system
      const deleteResponse = await fetch(`/api/user-upload?imageUrl=${encodeURIComponent(currentImage)}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      // Update user profile picture in database (set to null)
      const updateResponse = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: customerId,
          profilePicture: null,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update profile picture');
      }

      // Notify parent component
      onImageUpdate(null);

    } catch (error) {
      console.error('Delete error:', error);
      setUploadError(error.message || 'Failed to delete profile picture');
      onError?.(error.message || 'Failed to delete profile picture');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentImage || undefined} alt={customerName} />
          <AvatarFallback className="text-2xl">
            {customerName?.charAt(0)?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          onClick={triggerFileInput}
          disabled={isUploading || isDeleting}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{uploadError}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-destructive hover:text-destructive/80"
            onClick={() => setUploadError(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading || isDeleting}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>

        {currentImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteImage}
            disabled={isUploading || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </>
            )}
          </Button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        Upload a profile picture (JPEG, PNG, WebP - Max 2MB)
      </p>
    </div>
  );
}