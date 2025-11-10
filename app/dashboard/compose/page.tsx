"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { 
  X, 
  Image as ImageIcon, 
  SmilePlus, 
  CalendarClock, 
  MapPin, 
  Globe, 
  Loader2, 
  XCircle, 
  ImagePlus, 
  GanttChart 
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImagePreview {
  id: string
  url: string
  file: File
  publicId?: string
}

interface LocationData {
  lat: number
  lng: number
  name: string
}

// Allowed file types for upload
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ComposePage() {
  const router = useRouter()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState("")
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [images, setImages] = useState<ImagePreview[]>([])
  const [location, setLocation] = useState<LocationData | null>(null)
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null)

  useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.url))
    }
  }, [images])

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `File type not supported. Please upload: ${ALLOWED_FILE_TYPES.join(', ')}` 
      };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      };
    }
    
    return { valid: true };
  };

  const uploadImageToCloudinary = async (file: File, onProgress?: (progress: number) => void): Promise<{file: {url: string; publicId: string}}> => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || 'Upload failed'));
          } catch (e) {
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      xhr.open('POST', '/api/upload', true);
      xhr.send(formData);
    });
  };

  const deleteImageFromCloudinary = async (publicId: string) => {
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Filter and validate files
    const validFiles = Array.from(files).filter(file => {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: validation.error
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const imageId = Math.random().toString(36).substring(2, 9);
        
        // Set initial progress
        setUploadProgress(prev => ({
          ...prev,
          [imageId]: 0
        }));

        try {
          const result = await uploadImageToCloudinary(
            file,
            (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [imageId]: progress
              }));
            }
          ) as any;

          return {
            id: imageId,
            url: result.file.url,
            publicId: result.file.publicId,
            file
          };
        } catch (error) {
          // Remove failed upload from progress
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[imageId];
            return newProgress;
          });
          throw error;
        }
      });

      const newImages = await Promise.all(uploadPromises);

      // Add new images to the list
      setImages(prev => {
        const updated = [...prev, ...newImages];
        return updated.slice(0, 4);
      });

      // Clear progress
      setUploadProgress({});
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error.message || "Failed to upload images"
      });
    } finally {
      setIsUploading(false);
    }
  }

  const removeImage = async (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (!imageToRemove) return;

    try {
      // Remove from UI immediately for better UX
      setImages(prev => prev.filter(img => img.id !== id));
      
      // If the image was uploaded to Cloudinary, delete it
      if (imageToRemove.publicId) {
        await deleteImageFromCloudinary(imageToRemove.publicId);
      }
      
      // Revoke object URL to free memory
      if (imageToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url);
      }
    } catch (error) {
      console.error('Error removing image:', error);
      
      // Revert UI if deletion fails
      setImages(prev => [...prev, imageToRemove]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image. Please try again."
      });
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Geolocation not supported by your browser",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          const data = await response.json()
          setLocation({
            lat: latitude,
            lng: longitude,
            name: data.display_name || "Current Location",
          })
        } catch {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not get location name",
          })
        }
      },
      error => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Could not get your location",
        })
      }
    )
  }

  const handleCreatePost = async () => {
    if ((!content.trim() && images.length === 0) || content.length > 500) {
      toast({
        variant: "destructive",
        title: "Error",
        description: images.length === 0 
          ? "Please add some content or an image" 
          : "Content is too long"
      });
      return;
    }

    setIsCreatingPost(true);
    try {
      // Prepare post data with Cloudinary image URLs
      const postData = {
        content: content,
        images: images.map(img => img.url), // Send Cloudinary URLs
        ...(location && { location }),
        ...(scheduledTime && { scheduledTime: scheduledTime.toISOString() })
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        // Safely log error details without circular references
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          responseData: responseData ? {
            ...responseData,
            // Handle potential circular references in responseData
            error: responseData.error,
            message: responseData.message,
            details: responseData.details
          } : null,
          headers: {
            'content-type': response.headers.get('content-type'),
            'content-length': response.headers.get('content-length')
          }
        };
        
        console.error('Post creation failed:', JSON.stringify(errorDetails, null, 2));
        
        let errorMessage = 'Failed to create post';
        
        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = responseData.error || 'You do not have permission to perform this action.';
        } else if (response.status === 400 && responseData.details) {
          errorMessage = 'Validation error: ' + responseData.details.map((d: any) => d.message).join(', ');
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      toast({ 
        title: "Success", 
        description: "Your post has been created!" 
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error creating post:", err);
      
      // Log additional error details for debugging
      if (err.cause) {
        console.error('Error cause:', err.cause);
      }
      
      // Show error toast with the error message
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create post. Please try again.",
      });
    } finally {
      setIsCreatingPost(false);
    }
  }

  const isPostButtonDisabled =
    (!content.trim() && images.length === 0) ||
    content.length > 500 ||
    isCreatingPost

  if (!user) return null

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col w-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-emerald-200 dark:border-emerald-800 px-4">
        <div className="h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            disabled={isCreatingPost}
            className="p-2 -ml-2 rounded-full hover:bg-gray-200/80 dark:hover:bg-gray-800/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {scheduledTime && (
            <div className="flex items-center text-sm text-blue-500 font-medium">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span>Schedule Post</span>
            </div>
          )}

          <button
            onClick={handleCreatePost}
            disabled={isPostButtonDisabled}
            className={cn(
              "px-4 h-9 rounded-full font-bold text-sm",
              isPostButtonDisabled
                ? "bg-emerald-400/90 text-white/70"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            )}
          >
            {isCreatingPost ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : scheduledTime ? (
              "Schedule"
            ) : (
              "Post"
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pt-1 pb-20 w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div className="py-3 w-full">
          <div className="w-full">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[120px] border-0 text-base sm:text-lg p-0 focus-visible:ring-0 resize-none w-full"
              maxLength={500}
            />

            {/* Image preview */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {/* Show loading states */}
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={`upload-${id}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div 
                    className="absolute inset-0 bg-emerald-500/20 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-2 text-emerald-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Uploading... {progress}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show uploaded images */}
              {images.map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={image.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                    aria-label="Remove image"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Upload button - only show if we have less than 4 images */}
              {images.length + Object.keys(uploadProgress).length < 4 && (
                <div className="relative aspect-square">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    multiple
                    className="hidden"
                    disabled={isUploading}
                    aria-label="Upload images"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                    aria-label="Add images"
                  >
                    <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 mb-1" />
                    <span className="text-xs sm:text-sm">Add Image</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {images.length + Object.keys(uploadProgress).length}/4
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between py-2 w-full">
              <div className="flex items-center space-x-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isCreatingPost || images.length >= 4}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCreatingPost || images.length >= 4}
                        className={cn(
                          "p-2 rounded-full",
                          isCreatingPost || images.length >= 4
                            ? "text-emerald-400/50"
                            : "text-emerald-500 hover:bg-emerald-500/10"
                        )}
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Photos</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => getLocation()}
                        disabled={isCreatingPost}
                        className="p-2 rounded-full text-emerald-500 hover:bg-emerald-500/10"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Location</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        disabled={isCreatingPost}
                        className="p-2 rounded-full text-emerald-500 hover:bg-emerald-500/10"
                      >
                        <SmilePlus className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-2">
                {content.length > 0 && (
                  <div
                    className={cn(
                      "text-xs sm:text-sm",
                      content.length > 480
                        ? "text-red-500"
                        : content.length > 450
                        ? "text-yellow-500"
                        : "text-gray-500"
                    )}
                  >
                    {500 - content.length}
                  </div>
                )}
              </div>
            </div>

            {/* Location display */}
            {location && (
              <div className="mt-2 flex items-center text-emerald-500 text-sm w-full">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{location.name}</span>
                <button
                  onClick={() => setLocation(null)}
                  className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                  aria-label="Remove location"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border p-3 sm:hidden">
        <div className="w-full max-w-4xl mx-auto px-4 flex justify-end">
          <button
            onClick={handleCreatePost}
            disabled={isPostButtonDisabled}
            className={cn(
              "px-4 py-1.5 rounded-full font-medium text-sm",
              isPostButtonDisabled
                ? "bg-emerald-400/90 text-white/70"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            )}
          >
            {isCreatingPost ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
