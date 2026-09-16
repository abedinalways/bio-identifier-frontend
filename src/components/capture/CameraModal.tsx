'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (isCancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        activeStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch {
        if (!isCancelled) {
          setErrorMsg('Camera access denied or unavailable. Please check permissions or upload from gallery.');
        }
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
        onClose();
      }
    }, 'image/jpeg', 0.85);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-bg-surface border border-border-subtle shadow-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-bg-surface">
          <div className="flex items-center gap-2 font-semibold text-text-primary text-sm">
            <Camera className="w-4 h-4 text-brand-primary" />
            <span>{t.capture.cameraButton}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div className="relative aspect-4/3 bg-text-primary flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-venom-deadly mx-auto" />
              <p className="text-sm text-text-inverse font-medium">{errorMsg}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-8 border-2 border-brand-primary/80 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-text-primary/70 text-text-inverse">
                  Position biological specimen in frame
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-bg-surface border-t border-border-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={toggleFacingMode}
            className="p-2.5 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
            title="Switch camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleCapture}
            disabled={Boolean(errorMsg)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-brand-primary-foreground font-semibold text-sm hover:bg-brand-primary-hover active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Photo</span>
          </button>

          <div className="w-10" />
        </div>
      </div>
    </div>
  );
}
