'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing AI coach...');

  const messages = [
    'Initializing AI coach...',
    'Loading voice synthesis...',
    'Calibrating camera...',
    'Preparing training drills...',
    'Almost ready...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const msgIndex = Math.floor((progress / 100) * messages.length);
    if (msgIndex < messages.length) {
      setMessage(messages[msgIndex]);
    }
  }, [progress]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
        {/* Logo animation */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-boxing-red/30 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-boxing-red/50 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🥊</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">Fight Corner Coach</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>

        {/* Progress bar */}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-boxing-red transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progress}%</p>
      </div>
    </div>
  );
}
