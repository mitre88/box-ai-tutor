'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Square, SkipForward } from 'lucide-react';
import SessionTimer from './SessionTimer';
import DrillCard from './DrillCard';
import VoiceWave from './VoiceWave';

interface VoiceCoachProps {
  apiKey: string;
}

interface Drill {
  id: number;
  name: string;
  description: string;
  duration: number;
  type: 'warmup' | 'technique' | 'combo' | 'cooldown';
}

const SAMPLE_DRILLS: Drill[] = [
  { id: 1, name: 'Shadow Boxing', description: 'Freestyle movement, focus on form', duration: 180, type: 'warmup' },
  { id: 2, name: 'Jab-Cross Combos', description: 'Basic 1-2 combinations', duration: 120, type: 'technique' },
  { id: 3, name: 'Speed Drill', description: 'Maximum punch output', duration: 60, type: 'combo' },
  { id: 4, name: 'Defense & Slips', description: 'Head movement practice', duration: 120, type: 'technique' },
  { id: 5, name: 'Cool Down', description: 'Stretching and breathing', duration: 120, type: 'cooldown' },
];

export default function VoiceCoach({ apiKey }: VoiceCoachProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(SAMPLE_DRILLS[0].duration);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentDrill = SAMPLE_DRILLS[currentDrillIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleDrillComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining]);

  const handleDrillComplete = () => {
    if (currentDrillIndex < SAMPLE_DRILLS.length - 1) {
      setCurrentDrillIndex((prev) => prev + 1);
      setTimeRemaining(SAMPLE_DRILLS[currentDrillIndex + 1].duration);
      // Trigger voice announcement for next drill
      announceNextDrill(SAMPLE_DRILLS[currentDrillIndex + 1]);
    } else {
      setSessionComplete(true);
      setIsActive(false);
    }
  };

  const announceNextDrill = (drill: Drill) => {
    setIsSpeaking(true);
    // TODO: Integrate with ElevenLabs API
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const startSession = () => {
    setIsActive(true);
    setIsSpeaking(true);
    // Initial greeting
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const skipDrill = () => {
    handleDrillComplete();
  };

  const endSession = () => {
    setIsActive(false);
    setSessionComplete(true);
  };

  if (sessionComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Session Complete!</h2>
          <p className="text-gray-400 mb-6">
            Great work! You completed {SAMPLE_DRILLS.length} drills.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-boxing-red hover:bg-red-600 rounded-lg font-semibold"
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Fight Corner Coach</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-400">
            {isActive ? 'Active' : 'Ready'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        
        {/* Voice Visualization */}
        <div className="mb-8">
          <VoiceWave isActive={isSpeaking} />
        </div>

        {/* Timer */}
        {isActive && (
          <div className="mb-8">
            <SessionTimer seconds={timeRemaining} />
          </div>
        )}

        {/* Current Drill */}
        <div className="w-full mb-8">
          <DrillCard 
            drill={currentDrill} 
            isActive={isActive}
            progress={1 - (timeRemaining / currentDrill.duration)}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isActive ? (
            <button
              onClick={startSession}
              className="w-20 h-20 rounded-full bg-boxing-red hover:bg-red-600 neon-glow
                         flex items-center justify-center transition-transform hover:scale-105"
            >
              <Play className="w-8 h-8 ml-1" fill="white" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-16 h-16 rounded-full bg-dark-card border border-white/20
                           hover:border-boxing-red flex items-center justify-center"
              >
                {isPaused ? <Play className="w-6 h-6 ml-1" /> : <MicOff className="w-6 h-6" />}
              </button>
              
              <button
                onClick={endSession}
                className="w-20 h-20 rounded-full bg-boxing-red hover:bg-red-600
                           flex items-center justify-center"
              >
                <Square className="w-8 h-8" fill="white" />
              </button>

              <button
                onClick={skipDrill}
                className="w-16 h-16 rounded-full bg-dark-card border border-white/20
                           hover:border-boxing-red flex items-center justify-center"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Progress dots */}
        {isActive && (
          <div className="flex gap-2 mt-8">
            {SAMPLE_DRILLS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentDrillIndex ? 'bg-boxing-red' :
                  index < currentDrillIndex ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
