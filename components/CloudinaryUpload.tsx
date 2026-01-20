"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  folder?: string;
}

export default function CloudinaryUpload({
  onUploadComplete,
  currentImage,
  folder = 'blogs'
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with currentImage prop
  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      // Convert file to base64
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 40; // 0-40% for file reading
          setUploadProgress(percentComplete);
        }
      };

      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          setUploadProgress(40);
          const base64String = reader.result as string;

          // Upload to Cloudinary via our API
          const response = await fetch('/api/upload/cloudinary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: base64String,
              folder: `isha-portfolio/${folder}`
            }),
          });

          setUploadProgress(80);
          const data = await response.json();
          console.log('Upload response:', data);

          if (data.success && data.url) {
            console.log('Upload successful, URL:', data.url);
            setPreview(data.url);
            setUploadProgress(100);

            // Only report URL to parent; saving to DB handled by caller
            setTimeout(() => {
              onUploadComplete(data.url);
              setError('');
              setUploadProgress(0);
            }, 300);
          } else {
            const errorMsg = data.error || 'Upload failed';
            console.error('Upload error:', errorMsg);
            setError(errorMsg);
            setUploadProgress(0);
          }
        } catch (err) {
          const errorMsg = 'Failed to upload image';
          console.error('Upload error:', err);
          setError(errorMsg);
          setUploadProgress(0);
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
        setUploadProgress(0);
      };
    } catch (err) {
      setError('An error occurred');
      setUploading(false);
      setUploadProgress(0);
      console.error('File handling error:', err);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="cloudinary-upload"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="relative w-full h-48 bg-[#FAF0E6] rounded-xl overflow-hidden border-2 border-[#3B241A]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', preview, e);
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#3B241A] rounded-full p-2 shadow-lg"
                  type="button"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Change Image Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              type="button"
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#3B241A] bg-[#FAF0E6] hover:bg-[#3B241A]/5 rounded-lg transition-all border border-[#3B241A]/10 disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Change Image'}
            </motion.button>

            {/* Upload Progress Bar */}
            {uploading && uploadProgress > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 space-y-1"
              >
                <div className="w-full h-2 bg-[#3B241A]/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#F2A7A7] to-[#3B241A]"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-[#3B241A]/60 text-center">{Math.round(uploadProgress)}%</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            htmlFor="cloudinary-upload"
            className="block cursor-pointer"
          >
            <div className="relative w-full h-48 bg-[#FAF0E6] rounded-xl overflow-hidden border-2 border-dashed border-[#3B241A]/20 hover:border-[#F2A7A7] hover:bg-[#FAF0E6]/50 transition-all flex flex-col items-center justify-center gap-3 group">
              {uploading ? (
                <>
                  <div className="space-y-3 w-full px-8">
                    <Loader2 className="animate-spin text-[#F2A7A7] mx-auto" size={32} />
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-[#3B241A]/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#F2A7A7] to-[#3B241A]"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#3B241A]/60 text-center">
                        {Math.round(uploadProgress)}% Uploading...
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-[#3B241A]/5 group-hover:bg-[#F2A7A7]/20 transition-colors">
                    <ImageIcon size={28} className="text-[#3B241A]/40 group-hover:text-[#F2A7A7] transition-colors" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-bold text-[#3B241A] mb-1">
                      Click to upload image
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-[#3B241A]/40">
                      JPG, PNG, or GIF • Max 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.label>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100"
        >
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
