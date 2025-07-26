"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, AlertCircle } from "lucide-react";

export default function NewCustomerProfileUpload({ 
  currentImage, 
  customerName = "New Customer", 
  onImageUpdate, 
  onError 
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please select a valid image file');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      onError?.('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profile');

      const response = await fetch('/api/user-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      onImageUpdate?.(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImage) return;

    setDeleting(true);
    
    try {
      const response = await fetch('/api/user-upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: currentImage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete image');
      }

      onImageUpdate?.('');
    } catch (error) {
      console.error('Delete error:', error);
      onError?.(error.message || 'Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentImage || undefined} alt={customerName} />
          <AvatarFallback className="text-lg font-medium">
            {customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {currentImage && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleDeleteImage}
            disabled={deleting}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('new-customer-file-input').click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : currentImage ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        <input
          id="new-customer-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}