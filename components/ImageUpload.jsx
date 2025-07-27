"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Star,
  StarOff
} from "lucide-react";

export default function ImageUpload({ 
  images = [], 
  onImagesChange, 
  maxImages = 5,
  disabled = false 
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;
    
    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages = [];

    try {
      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        newImages.push({
          id: `temp-${Date.now()}-${Math.random()}`, // Temporary ID
          imageUrl: result.url,
          isFeatured: images.length === 0 && newImages.length === 0, // First image is featured
          isNew: true // Mark as new for saving later
        });
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];
    
    // If it's a newly uploaded image (not saved to database yet), delete the physical file
    if (imageToRemove.isNew && imageToRemove.imageUrl) {
      try {
        await fetch(`/api/upload?imageUrl=${encodeURIComponent(imageToRemove.imageUrl)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting physical file:', error);
        // Continue with removal from UI even if file deletion fails
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    
    // If we removed the featured image, make the first remaining image featured
    if (imageToRemove.isFeatured && newImages.length > 0) {
      newImages[0].isFeatured = true;
    }
    
    onImagesChange(newImages);
  };

  const setFeatured = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isFeatured: i === index
    }));
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <CardContent className="flex flex-col items-center justify-center py-2">
            <Upload className="h-4 w-4 text-muted-foreground mb-1" />
            <div className="text-center">
              <p className="text-xs font-medium">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </p>
              <p className="text-xs text-muted-foreground">
                Up to {maxImages} images ({images.length}/{maxImages})
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
          {images.map((image, index) => (
            <Card key={image.id || index} className="relative group">
              <CardContent className="p-1">
                <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
                  <img
                    src={image.imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png'; // Fallback image
                    }}
                  />
                  
                  {/* Featured Badge */}
                  {image.isFeatured && (
                    <Badge
                      variant="default"
                      className="absolute top-1 left-1 text-xs px-1 py-0"
                    >
                      ★
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeatured(index);
                      }}
                      disabled={disabled}
                      title={image.isFeatured ? "Featured image" : "Set as featured"}
                    >
                      {image.isFeatured ? (
                        <Star className="h-3 w-3 fill-current" />
                      ) : (
                        <StarOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      disabled={disabled}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Text */}
      {images.length === 0 && (
        <div className="text-center py-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No images uploaded yet. Add up to {maxImages} product images.
          </p>
        </div>
      )}
    </div>
  );
}