'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Camera,
  X,
  MapPin,
  Sprout,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { CameraModal } from './CameraModal';
import { compressImage } from '../../lib/imageCompression';
import type { CropType } from '../../core/types';

interface ImageUploaderProps {
  mode: 'snake' | 'pest';
  onIdentify: (payload: {
    file: File;
    region: string;
    cropType?: CropType;
  }) => void;
  isLoading?: boolean;
}

const REGIONS = [
  'Bangladesh (Dhaka / Central)',
  'Bangladesh (Rajshahi / North-West)',
  'Bangladesh (Khulna / South-West)',
  'Bangladesh (Chattogram / South-East)',
  'Bangladesh (Sylhet / North-East)',
  'India (West Bengal / East)',
  'India (Northern Plains / UP / Bihar)',
  'India (Southern States / Kerala / TN)',
  'India (Western States / Maharashtra)',
  'Pakistan (Punjab / Sindh)',
  'Other / General South Asia',
];

const CROPS: Array<{ id: CropType; label: string }> = [
  { id: 'mango', label: 'Mango (আম / आम)' },
  { id: 'litchi', label: 'Litchi (লিচু / लीची)' },
  { id: 'rice', label: 'Paddy / Rice (ধান / चावल)' },
  { id: 'potato', label: 'Potato (আলু / आलू)' },
  { id: 'vegetables', label: 'Vegetables (শাকসবজি / सब्जियां)' },
  { id: 'guava', label: 'Guava (পেয়ারা / अमरूद)' },
  { id: 'jute', label: 'Jute (পাট / पटसन)' },
];

export function ImageUploader({
  mode,
  onIdentify,
  isLoading = false,
}: ImageUploaderProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [cropType, setCropType] = useState<CropType>('mango');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processSelectedFile = async (file: File) => {
    try {
      setIsCompressing(true);
      const { file: compressed, dataUrl } = await compressImage(file, {
        maxDimension: 1280,
        quality: 0.85,
      });
      setSelectedFile(compressed);
      setPreviewUrl(dataUrl);
    } catch {
      // If compression fails, fall back to raw file
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleCameraCapture = (blob: Blob) => {
    const file = new File([blob], `capture-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    processSelectedFile(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    onIdentify({
      file: selectedFile,
      region,
      cropType: mode === 'pest' ? cropType : undefined,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-bg-surface/95 backdrop-blur-md border border-border-subtle shadow-xl p-6 sm:p-8 ring-1 ring-border-subtle/60 relative overflow-hidden">
      {/* Subtle top ambient highlight */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-brand-primary/40 to-transparent" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-subtle border border-border-subtle text-[11px] font-bold text-text-muted">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Neural Bio-Scanner v2.4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            {t.capture.uploadTitle}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
            {t.capture.uploadSubtitle}
          </p>
        </div>

        {/* Dropzone & Preview Box */}
        {!previewUrl ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="group relative border-2 border-dashed border-border-strong hover:border-brand-primary rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-bg-subtle/50 hover:bg-brand-primary/5 transition-all cursor-pointer shadow-inner"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-text-primary mb-1">
              {t.capture.dragDrop}
            </p>
            <p className="text-xs text-text-muted mb-5">
              Supports wild field photos, gardens, trees, ground, or biological
              specimens
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2.5 rounded-xl bg-bg-surface border border-border-strong text-xs font-bold text-text-primary hover:bg-bg-subtle transition-all shadow-xs"
              >
                {t.capture.browseButton}
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsCameraModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary text-brand-primary-foreground text-xs font-bold hover:bg-brand-primary-hover transition-all shadow-sm active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{t.capture.cameraButton}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-border-strong bg-text-primary aspect-16/10 flex items-center justify-center shadow-inner">
            <Image
              src={previewUrl}
              alt="Specimen preview"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={clearSelection}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-black transition-colors shadow-lg"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/80 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-md border border-white/10 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Optimized for AI Specimen Diagnosis</span>
            </div>
          </div>
        )}

        {/* Dynamic Context Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Region Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-primary" />
              <span>{t.capture.regionLabel}</span>
            </label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs font-semibold focus:outline-hidden focus:border-brand-primary transition-colors shadow-2xs"
            >
              {REGIONS.map(reg => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Selector (when in pest mode) */}
          {mode === 'pest' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-brand-primary" />
                <span>{t.capture.cropLabel}</span>
              </label>
              <select
                value={cropType}
                onChange={e => setCropType(e.target.value as CropType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs font-semibold focus:outline-hidden focus:border-brand-primary transition-colors shadow-2xs"
              >
                {CROPS.map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={!selectedFile || isLoading || isCompressing}
          className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-emerald-600 via-brand-primary to-teal-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isCompressing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.capture.analyzing}</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.capture.submitBtn}</span>
            </>
          )}
        </button>
      </form>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}
