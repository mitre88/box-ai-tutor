'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

interface CameraProps {
  onFrame?: (videoElement: HTMLVideoElement) => void;
  isAnalyzing?: boolean;
}

export default function CameraFeed({ onFrame, isAnalyzing }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

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
    setTimeout(startCamera, 100);
  };

  // Frame capture for AI analysis
  useEffect(() => {
    if (!isActive || !onFrame || !videoRef.current) return;

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        onFrame(videoRef.current);
      }
    }, 1000); // Capture 1 frame per second for analysis

    return () => clearInterval(interval);
  }, [isActive, onFrame]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-card">
      {!isActive ? (
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
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Analysis overlay */}
          {isAnalyzing && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Analyzing stance...</span>
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
