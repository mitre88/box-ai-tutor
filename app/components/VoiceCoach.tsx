'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Play, Square, SkipForward } from 'lucide-react';
import SessionTimer from './SessionTimer';
import DrillCard from './DrillCard';
import VoiceWave from './VoiceWave';
import CameraFeed from './CameraFeed';

interface UserProfile {
  name: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  stance: 'orthodox' | 'southpaw';
  focus: 'technique' | 'cardio' | 'power' | 'defense';
}

interface VoiceCoachProps {
  mistralKey: string;
  elevenLabsKey: string;
  userProfile: UserProfile;
  onSessionComplete: (data: any) => void;
}

interface Drill {
  id: number;
  name: string;
  description: string;
  duration: number;
  type: 'warmup' | 'technique' | 'combo' | 'cooldown';
  instructions: string[];
}

const BOXING_DRILLS: Drill[] = [
  { 
    id: 1, 
    name: 'Stance & Movement', 
    description: 'Find your balance, light on your feet', 
    duration: 120, 
    type: 'warmup',
    instructions: ['Hands up, chin down', 'Bounce lightly', 'Stay on balls of feet']
  },
  { 
    id: 2, 
    name: 'Jab-Cross Fundamentals', 
    description: 'Perfect your 1-2 combination', 
    duration: 180, 
    type: 'technique',
    instructions: ['Extend jab fully', 'Rotate hips on cross', 'Return to guard quickly']
  },
  { 
    id: 3, 
    name: 'Speed Round', 
    description: 'Maximum output, maintain form', 
    duration: 60, 
    type: 'combo',
    instructions: ['Fast hands', 'Don\'t sacrifice technique', 'Breathe with each punch']
  },
  { 
    id: 4, 
    name: 'Defense Master', 
    description: 'Slips, rolls, and counters', 
    duration: 150, 
    type: 'technique',
    instructions: ['Slip left, slip right', 'Roll under imaginary punches', 'Counter after defense']
  },
  { 
    id: 5, 
    name: 'Hooks & Uppercuts', 
    description: 'Power shots from close range', 
    duration: 180, 
    type: 'combo',
    instructions: ['Keep elbow up on hooks', 'Drive from legs on uppercuts', 'Stay balanced']
  },
  { 
    id: 6, 
    name: 'Cool Down', 
    description: 'Breathing and stretching', 
    duration: 120, 
    type: 'cooldown',
    instructions: ['Deep breaths', 'Shake out arms', 'Reflect on session']
  },
];

export default function VoiceCoach({ mistralKey, elevenLabsKey, userProfile, onSessionComplete }: VoiceCoachProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(BOXING_DRILLS[0].duration);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [coachMessage, setCoachMessage] = useState(`Welcome ${userProfile.name}! Enable your camera and press start when you're ready.`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] = useState<string | null>(null);

  const currentDrill = BOXING_DRILLS[currentDrillIndex];

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

  // Frame analysis callback
  const handleFrame = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!isActive || isPaused) return;
    
    // TODO: @Mi_codex_bot - Send frame to Mistral for analysis
    // This is where you'd capture the canvas and send to Mistral API
    setIsAnalyzing(true);
    
    // Simulate analysis feedback
    // In real implementation, this would come from Mistral API
    // Example: Send base64 image to Mistral with prompt about boxing stance
    
  }, [isActive, isPaused, mistralKey]);

  const handleDrillComplete = () => {
    if (currentDrillIndex < BOXING_DRILLS.length - 1) {
      const nextIndex = currentDrillIndex + 1;
      setCurrentDrillIndex(nextIndex);
      setTimeRemaining(BOXING_DRILLS[nextIndex].duration);
      announceDrill(BOXING_DRILLS[nextIndex], true);
    } else {
      // Session complete - report data
      const sessionData = {
        duration: BOXING_DRILLS.reduce((acc, drill) => acc + drill.duration, 0),
        drillsCompleted: BOXING_DRILLS.length,
        punchesThrown: Math.floor(Math.random() * 200) + 100, // Placeholder - real data from analysis
        accuracy: Math.floor(Math.random() * 30) + 70, // Placeholder
        caloriesBurned: Math.floor(Math.random() * 300) + 200, // Placeholder
        coachFeedback: [
          'Good stance throughout most drills',
          'Keep working on hip rotation for power',
          'Excellent hand speed in round 3',
          'Remember to breathe consistently',
        ],
      };
      onSessionComplete(sessionData);
    }
  };

  const announceDrill = (drill: Drill, autoPlay: boolean = false) => {
    setIsSpeaking(true);
    setCoachMessage(`${drill.name}. ${drill.description}. Ready? Let's go!`);
    
    // TODO: @Mi_codex_bot - Integrate ElevenLabs TTS here
    // Use elevenLabsKey for API call
    
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const startSession = () => {
    setIsActive(true);
    setIsSpeaking(true);
    const greeting = userProfile.name ? `Welcome back ${userProfile.name}!` : 'Welcome to Fight Corner!';
    setCoachMessage(`${greeting} I'm watching your form. Let's start with ${currentDrill.name}. Get in your stance.`);
    
    // TODO: @Mi_codex_bot - ElevenLabs welcome message
    // Also start the camera analysis loop
    
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const skipDrill = () => {
    handleDrillComplete();
  };

  const endSession = () => {
    const completedDrills = currentDrillIndex;
    const totalDuration = BOXING_DRILLS.slice(0, completedDrills).reduce((acc, drill) => acc + drill.duration, 0)
      + (BOXING_DRILLS[completedDrills]?.duration || 0) - timeRemaining;
    
    const sessionData = {
      duration: totalDuration,
      drillsCompleted: completedDrills,
      punchesThrown: Math.floor(Math.random() * 150) + 50,
      accuracy: Math.floor(Math.random() * 25) + 65,
      caloriesBurned: Math.floor(Math.random() * 200) + 100,
      coachFeedback: [
        'Session ended early but good effort',
        'Focus on completing full rounds next time',
        'Your stance is improving',
      ],
    };
    onSessionComplete(sessionData);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Fight Corner Coach</h1>
          <p className="text-xs text-gray-400">AI Boxing Coach with Vision</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs text-gray-400">
            {isActive ? 'Coach Active' : 'Standby'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Column - Camera */}
        <div className="flex flex-col gap-4">
          {/* Camera Feed */}
          <CameraFeed 
            onFrame={handleFrame} 
            isAnalyzing={isAnalyzing}
          />

          {/* Analysis Feedback */}
          {analysisFeedback && (
            <div className="glass-card rounded-xl p-4 border-l-4 border-boxing-red">
              <h4 className="text-sm font-semibold text-boxing-red mb-1">Coach Observation:</h4>
              <p className="text-sm text-white/80">{analysisFeedback}</p>
            </div>
          )}
        </div>

        {/* Right Column - Controls & Info */}
        <div className="flex flex-col">
          {/* Coach Message */}
          <div className="glass-card rounded-xl p-4 mb-4 text-center">
            <p className="text-lg text-white/90 italic">"{coachMessage}"</p>
          </div>

          {/* Voice Visualization */}
          <div className="flex justify-center mb-4">
            <VoiceWave isActive={isSpeaking} />
          </div>

          {/* Timer */}
          {isActive && (
            <div className="flex justify-center mb-4">
              <SessionTimer seconds={timeRemaining} />
            </div>
          )}

          {/* Current Drill */}
          <div className="mb-4">
            <DrillCard 
              drill={currentDrill} 
              isActive={isActive}
              progress={1 - (timeRemaining / currentDrill.duration)}
            />
          </div>

          {/* Instructions */}
          {isActive && (
            <div className="glass-card rounded-xl p-4 mb-4 flex-1">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Coach Tips:</h4>
              <ul className="space-y-2">
                {currentDrill.instructions.map((tip, idx) => (
                  <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                    <span className="text-boxing-red mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-auto">
            {!isActive ? (
              <button
                onClick={startSession}
                className="w-20 h-20 rounded-full bg-boxing-red hover:bg-red-600 neon-glow
                           flex items-center justify-center transition-transform hover:scale-105 pulse-ring"
              >
                <Play className="w-8 h-8 ml-1" fill="white" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-14 h-14 rounded-full bg-dark-card border border-white/20
                             hover:border-boxing-red flex items-center justify-center transition-colors"
                >
                  {isPaused ? <Play className="w-5 h-5 ml-0.5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={endSession}
                  className="w-16 h-16 rounded-full bg-boxing-red hover:bg-red-600
                             flex items-center justify-center transition-colors"
                >
                  <Square className="w-6 h-6" fill="white" />
                </button>

                <button
                  onClick={skipDrill}
                  className="w-14 h-14 rounded-full bg-dark-card border border-white/20
                             hover:border-boxing-red flex items-center justify-center transition-colors"
                  title="Skip to next drill"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Progress dots */}
          {isActive && (
            <div className="flex justify-center gap-2 mt-4">
              {BOXING_DRILLS.map((_, index) => (
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

      {/* Footer info */}
      <footer className="mt-6 pt-4 text-center border-t border-white/10">
        <p className="text-xs text-gray-600">
          Vision analysis powered by Mistral AI • Voice by ElevenLabs
        </p>
      </footer>
    </div>
  );
}
