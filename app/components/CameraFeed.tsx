'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

interface CameraProps {
  onFrame?: (videoElement: HTMLVideoElement) => void;
  isAnalyzing?: boolean;
  feedbackLabel?: string | null;
  feedbackTone?: 'good' | 'adjust' | 'neutral';
}

export default function CameraFeed({ onFrame, isAnalyzing, feedbackLabel, feedbackTone = 'neutral' }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const attachStream = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    setIsActive(true);
    setError(null);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      attachStream(stream);
    } catch {
      setError('Camera access denied. Please allow camera permissions.');
      setIsActive(false);
    }
  }, [facingMode, attachStream]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Re-start camera when facingMode changes (after a switch)
  useEffect(() => {
    // Only re-start if we were previously active (i.e. user triggered a switch)
    if (streamRef.current === null && !isActive && error === null) return;
    if (!isActive && error === null) {
      startCamera();
    }
  }, [facingMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure stream is attached to video element after render
  useEffect(() => {
    if (isActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Frame capture for AI analysis
  useEffect(() => {
    if (!isActive || !onFrame || !videoRef.current) return;

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        onFrame(videoRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onFrame]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-card">
      {/* Video element is always in the DOM so the ref is available */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isActive ? 'block' : 'hidden'}`}
      />

      {!isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-dark-card border border-white/10 flex items-center justify-center mb-4">
            <CameraOff className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm mb-4">Camera is off</p>
          {error && (
            <p className="text-red-400 text-xs mb-4 max-w-[80%] text-center">{error}</p>
          )}
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-boxing-red hover:bg-red-600 rounded-lg text-sm font-medium"
          >
            Enable Camera
          </button>
        </div>
      )}

      {isActive && (
        <>
          {/* Analysis overlay */}
          {isAnalyzing && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Analyzing stance...</span>
            </div>
          )}

          {feedbackLabel && (
            <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur
              ${feedbackTone === 'good' ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100' :
                feedbackTone === 'adjust' ? 'bg-amber-500/20 border-amber-400/40 text-amber-100' :
                'bg-slate-500/20 border-slate-400/40 text-slate-100'}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {feedbackLabel}
            </div>
          )}

          {/* Camera controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={toggleCamera}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
            >
              <CameraOff className="w-5 h-5" />
            </button>
            <button
              onClick={switchCamera}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Grid overlay for boxing reference */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute inset-0 ring-2 rounded-xl transition-all duration-300
              ${feedbackTone === 'good' ? 'ring-emerald-400/40' : feedbackTone === 'adjust' ? 'ring-amber-400/40' : 'ring-transparent'}`}
            />
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/5" />
              ))}
            </div>
            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border border-boxing-red/30 rounded-full" />
              <div className="absolute w-1 h-4 bg-boxing-red/50" />
              <div className="absolute w-4 h-1 bg-boxing-red/50" />
            </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
