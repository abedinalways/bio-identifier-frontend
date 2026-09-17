'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Link2,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

interface ImageInputSelectorProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export const ImageInputSelector: React.FC<ImageInputSelectorProps> = ({
  value,
  onChange,
  label = 'Specimen Photo',
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>(
    value && !value.startsWith('/api') && !value.startsWith('data:')
      ? 'url'
      : 'upload',
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    setImageLoadError(false);

    try {
      // 1. Client-side fast compression
      const { file: compressedFile, dataUrl } = await compressImage(file, {
        maxDimension: 1200,
        quality: 0.85,
        mimeType: 'image/webp',
      });

      // 2. Upload to backend server
      const formData = new FormData();
      formData.append('image', compressedFile);

      try {
        const res = await fetch('/api/v1/uploads', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          const serverUrl = json?.data?.url || json?.url;
          if (serverUrl) {
            onChange(serverUrl);
            setIsUploading(false);
            return;
          }
        }
      } catch (uploadErr) {
        console.warn(
          'Server upload unavailable, using compressed data URL fallback:',
          uploadErr,
        );
      }

      // 3. Fallback to optimized data URL
      onChange(dataUrl);
    } catch (err: any) {
      console.error('Image processing failed:', err);
      setUploadError(err?.message || 'Failed to process image file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    onChange('');
    setImageLoadError(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getImageSourceLabel = () => {
    if (!value) return '';
    if (value.startsWith('/api/v1/uploads')) return 'Uploaded to Server';
    if (value.startsWith('data:')) return 'Local Data Image';
    return 'Web Image Link';
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-bold text-text-primary">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-bg-subtle p-0.5 border border-border-subtle">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-brand-primary text-white shadow-2xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
              activeTab === 'url'
                ? 'bg-brand-primary text-white shadow-2xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Input Mode Controls */}
      {activeTab === 'upload' ? (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isUploading
              ? 'border-brand-primary bg-brand-primary/5'
              : 'border-border-subtle hover:border-brand-primary hover:bg-bg-subtle/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
              <span className="font-bold text-brand-primary text-xs">
                Compressing & Uploading image...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-text-primary">
                  Click to choose file or drag & drop here
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Supports JPG, PNG, WebP (Automatically compressed to
                  &lt;300KB)
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Link2 className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            inputMode="url"
            value={value}
            onChange={e => {
              onChange(e.target.value);
              setImageLoadError(false);
            }}
            placeholder="https://images.unsplash.com/... or cloud image link"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono"
          />
          {value && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Live Image Preview Card */}
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-bg-subtle border border-border-subtle animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-surface border border-border-subtle shrink-0 relative flex items-center justify-center">
            {imageLoadError ? (
              <div className="flex flex-col items-center justify-center text-text-muted p-1 text-center">
                <AlertCircle className="w-4 h-4 text-danger-500" />
                <span className="text-[9px] mt-0.5">Broken</span>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value}
                alt="Specimen Preview"
                onError={() => setImageLoadError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>{getImageSourceLabel()}</span>
              </span>
            </div>
            <p className="text-[11px] text-text-muted truncate mt-1 font-mono">
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="px-2.5 py-1.5 rounded-lg border border-border-subtle hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 text-text-secondary text-[11px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};
