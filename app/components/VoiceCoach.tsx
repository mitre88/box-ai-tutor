'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Play, Square, SkipForward, AlertCircle } from 'lucide-react';
import SessionTimer from './SessionTimer';
import DrillCard from './DrillCard';
import VoiceWave from './VoiceWave';
import CameraFeed from './CameraFeed';
import { useElevenLabs } from '../hooks/useElevenLabs';
import { useMistralVision } from '../hooks/useMistralVision';

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

// Drills adaptados por nivel de experiencia
const DRILLS_BY_LEVEL: Record<UserProfile['experience'], Drill[]> = {
  beginner: [
    { id: 1, name: 'Basic Stance', description: 'Learn the fighting stance', duration: 120, type: 'warmup', instructions: ['Feet shoulder-width apart', 'Left foot forward (orthodox)', 'Hands up, elbows in'] },
    { id: 2, name: 'Jab Practice', description: 'Master the jab', duration: 180, type: 'technique', instructions: ['Step in with jab', 'Full extension', 'Snap it back quickly'] },
    { id: 3, name: 'Rest & Recover', description: 'Catch your breath', duration: 60, type: 'cooldown', instructions: ['Deep breathing', 'Shake out arms', 'Stay loose'] },
  ],
  intermediate: [
    { id: 1, name: 'Stance & Movement', description: 'Footwork fundamentals', duration: 120, type: 'warmup', instructions: ['Stay on balls of feet', 'Light bounce', 'Stay balanced'] },
    { id: 2, name: 'Jab-Cross Combos', description: 'Basic combinations', duration: 180, type: 'technique', instructions: ['Jab to measure', 'Cross with power', 'Return to guard'] },
    { id: 3, name: 'Defense Basics', description: 'Slips and rolls', duration: 120, type: 'technique', instructions: ['Slip left, slip right', 'Roll under', 'Counter after defense'] },
    { id: 4, name: 'Cool Down', description: 'Stretch and recover', duration: 120, type: 'cooldown', instructions: ['Deep breaths', 'Stretch shoulders', 'Reflect on session'] },
  ],
  advanced: [
    { id: 1, name: 'Advanced Footwork', description: 'Angles and pivots', duration: 120, type: 'warmup', instructions: ['Pivot out', 'Create angles', 'Control distance'] },
    { id: 2, name: 'Combination Flow', description: '3-4 punch combos', duration: 180, type: 'combo', instructions: ['Jab-jab-cross-hook', 'Flow smoothly', 'Maintain form'] },
    { id: 3, name: 'Counter Punching', description: 'Defense to offense', duration: 180, type: 'technique', instructions: ['Slip and counter', 'Timing is key', 'Exploit openings'] },
    { id: 4, name: 'Power Round', description: 'Maximum output', duration: 60, type: 'combo', instructions: ['High intensity', 'Power on every shot', 'Stay technical'] },
    { id: 5, name: 'Recovery', description: 'Active recovery', duration: 120, type: 'cooldown', instructions: ['Controlled breathing', 'Light movement', 'Stay warm'] },
  ],
  pro: [
    { id: 1, name: 'Pro Warmup', description: 'Ring movement', duration: 120, type: 'warmup', instructions: ['Circle the ring', 'In-out movement', 'Control center'] },
    { id: 2, name: 'Precision Combos', description: 'Fight-specific patterns', duration: 180, type: 'combo', instructions: ['Body-head combinations', 'Change levels', 'Sell the fake'] },
    { id: 3, name: 'Advanced Defense', description: 'Elusive movement', duration: 180, type: 'technique', instructions: ['Draw and counter', 'Pivot and angle', 'Make them miss'] },
    { id: 4, name: 'Fight Simulation', description: 'Championship rounds', duration: 180, type: 'combo', instructions: ['Championship pace', 'Every shot matters', 'Mental toughness'] },
    { id: 5, name: 'Burnout Round', description: 'Empty the tank', duration: 60, type: 'combo', instructions: ['Everything you have', 'Finish strong', 'Champion mindset'] },
    { id: 6, name: 'Pro Cooldown', description: 'Professional recovery', duration: 180, type: 'cooldown', instructions: ['Systematic stretching', 'Mental review', 'Prepare for next'] },
  ],
};

export default function VoiceCoach({ mistralKey, elevenLabsKey, userProfile, onSessionComplete }: VoiceCoachProps) {
  const { speak } = useElevenLabs(elevenLabsKey);
  const { analyzeFrame } = useMistralVision(mistralKey);
  
  const drills = DRILLS_BY_LEVEL[userProfile.experience];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(drills[0].duration);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [coachMessage, setCoachMessage] = useState(`Welcome ${userProfile.name}! Enable your camera and press start when ready.`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] = useState<string[]>([]);
  const [poseScores, setPoseScores] = useState({ stance: 0, guard: 0, balance: 0 });
  const [sessionStats, setSessionStats] = useState({
    punchesEstimated: 0,
    avgAccuracy: 0,
    totalDuration: 0,
    feedbackItems: [] as string[]
  });

  const currentDrill = drills[currentDrillIndex];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
        setSessionStats(s => ({ ...s, totalDuration: s.totalDuration + 1 }));
      }, 1000);
    } else if (timeRemaining === 0) {
      handleDrillComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining]);

  // Frame analysis every 3 seconds
  useEffect(() => {
    if (!isActive || isPaused) return;
    
    const interval = setInterval(() => {
      captureAndAnalyze();
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, currentDrillIndex]);

  const captureAndAnalyze = async () => {
    // TODO: Implementar captura real de canvas
    // Por ahora simulamos para demo
    setIsAnalyzing(true);
    
    try {
      // Simular llamada a Mistral
      await new Promise(r => setTimeout(r, 1500));
      
      const mockFeedback = [
        'Hands up, chin tucked',
        'Stay on the balls of your feet',
        'Good rotation on that cross'
      ];
      
      setAnalysisFeedback(mockFeedback);
      setPoseScores({
        stance: Math.floor(Math.random() * 20) + 80,
        guard: Math.floor(Math.random() * 20) + 75,
        balance: Math.floor(Math.random() * 20) + 85
      });
      
      // Feedback por voz cada 3 análisis
      if (Math.random() > 0.5) {
        const randomTip = mockFeedback[Math.floor(Math.random() * mockFeedback.length)];
        await giveVoiceFeedback(randomTip);
      }
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const giveVoiceFeedback = async (message: string) => {
    setIsSpeaking(true);
    setCoachMessage(message);
    await speak(message);
    setIsSpeaking(false);
  };

  const handleDrillComplete = async () => {
    if (currentDrillIndex < drills.length - 1) {
      const nextIndex = currentDrillIndex + 1;
      setCurrentDrillIndex(nextIndex);
      setTimeRemaining(drills[nextIndex].duration);
      await announceDrill(drills[nextIndex]);
    } else {
      await completeSession();
    }
  };

  const announceDrill = async (drill: Drill) => {
    const message = `Next up: ${drill.name}. ${drill.description}. Ready?`;
    await giveVoiceFeedback(message);
  };

  const startSession = async () => {
    setIsActive(true);
    const welcomeMsg = `Alright ${userProfile.name}, let's work on your ${userProfile.focus}. Starting with ${currentDrill.name}.`;
    await giveVoiceFeedback(welcomeMsg);
  };

  const completeSession = async () => {
    const finalMsg = `Great work ${userProfile.name}! Session complete. You pushed hard today.`;
    await giveVoiceFeedback(finalMsg);
    
    onSessionComplete({
      duration: sessionStats.totalDuration,
      drillsCompleted: drills.length,
      punchesThrown: Math.floor(sessionStats.totalDuration * 1.5), // Estimado
      accuracy: Math.floor((poseScores.stance + poseScores.guard + poseScores.balance) / 3),
      caloriesBurned: Math.floor(sessionStats.totalDuration * 0.15),
      coachFeedback: analysisFeedback.length > 0 ? analysisFeedback : ['Great form throughout', 'Stay consistent with training']
    });
  };

  const skipDrill = () => handleDrillComplete();
  const endSession = () => completeSession();

  return (
    <div className="min-h-screen p-4 lg:p-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h1 className="text-xl font-bold">Fight Corner Coach</h1>
          <p className="text-xs text-gray-400">Level: {userProfile.experience}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <div className="flex items-center gap-1 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Analyzing...
            </div>
          )}
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1">
        {/* Left Column - Camera */}
        <div className="flex flex-col gap-4">
          <CameraFeed onFrame={() => {}} isAnalyzing={isAnalyzing} />

          {/* Pose Scores */}
          {isActive && (
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-400 mb-3">Form Analysis</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Stance', score: poseScores.stance },
                  { label: 'Guard', score: poseScores.guard },
                  { label: 'Balance', score: poseScores.balance },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className={`text-2xl font-bold ${
                      item.score >= 80 ? 'text-green-400' : 
                      item.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {item.score}
                    </div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Feedback */}
          {analysisFeedback.length > 0 && (
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-xs font-semibold text-boxing-red mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Coach Observations
              </h4>
              <ul className="space-y-1">
                {analysisFeedback.slice(0, 3).map((feedback, idx) => (
                  <li key={idx} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-boxing-red">•</span>
                    {feedback}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Controls */}
        <div className="flex flex-col">
          {/* Coach Message */}
          <div className="glass-card rounded-xl p-4 mb-4">
            <p className="text-base lg:text-lg text-white/90 italic">"{coachMessage}"</p>
          </div>

          {/* Voice Wave */}
          <div className="flex justify-center mb-4">
            <VoiceWave isActive={isSpeaking} />
          </div>

          {/* Timer */}
          {isActive && (
            <div className="flex justify-center mb-4">
              <SessionTimer seconds={timeRemaining} />
            </div>
          )}

          {/* Drill Card */}
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
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Focus Points:</h4>
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
                             hover:border-boxing-red flex items-center justify-center"
                >
                  {isPaused ? <Play className="w-5 h-5 ml-0.5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={endSession}
                  className="w-16 h-16 rounded-full bg-boxing-red hover:bg-red-600 flex items-center justify-center"
                >
                  <Square className="w-6 h-6" fill="white" />
                </button>

                <button
                  onClick={skipDrill}
                  className="w-14 h-14 rounded-full bg-dark-card border border-white/20
                             hover:border-boxing-red flex items-center justify-center"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Progress */}
          {isActive && (
            <div className="flex justify-center gap-2 mt-4">
              {drills.map((_, index) => (
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

      <footer className="mt-4 pt-4 text-center border-t border-white/10">
        <p className="text-xs text-gray-600">
          Mistral Vision • ElevenLabs Voice • Professional Boxing Coach
        </p>
      </footer>
    </div>
  );
}
