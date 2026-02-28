'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Play, Square, SkipForward, RotateCcw, AudioLines } from 'lucide-react';
import SessionTimer from './SessionTimer';
import DrillCard from './DrillCard';
import VoiceWave from './VoiceWave';
import CameraFeed from './CameraFeed';
import { loadDifficulty, saveSession } from '../lib/storage';
import type { Difficulty } from '../lib/storage';

interface VoiceCoachProps {
  mistralKey: string;
  elevenLabsKey: string;
}

interface Drill {
  id: number;
  name: string;
  description: string;
  duration: number;
  type: 'warmup' | 'technique' | 'combo' | 'cooldown';
  instructions: string[];
}

const DRILLS_BY_DIFFICULTY: Record<Difficulty, Drill[]> = {
  beginner: [
    { id: 1, name: 'Basic Stance', description: 'Learn proper boxing stance', duration: 90, type: 'warmup', instructions: ['Feet shoulder-width apart', 'Hands up by cheeks', 'Slight bend in knees'] },
    { id: 2, name: 'Jab Practice', description: 'Master the basic jab', duration: 120, type: 'technique', instructions: ['Extend arm straight', 'Snap it back quick', 'Keep other hand up'] },
    { id: 3, name: 'Basic Footwork', description: 'Move forward, back, and side to side', duration: 90, type: 'technique', instructions: ['Small steps only', 'Never cross your feet', 'Stay light on toes'] },
    { id: 4, name: 'Jab-Cross Intro', description: 'Your first combination', duration: 120, type: 'combo', instructions: ['Jab with lead hand', 'Cross with rear hand', 'Return to guard'] },
    { id: 5, name: 'Cool Down', description: 'Breathing and stretching', duration: 90, type: 'cooldown', instructions: ['Deep breaths', 'Shake out arms', 'Stretch shoulders'] },
  ],
  intermediate: [
    { id: 1, name: 'Stance & Movement', description: 'Find your balance, light on your feet', duration: 120, type: 'warmup', instructions: ['Hands up, chin down', 'Bounce lightly', 'Stay on balls of feet'] },
    { id: 2, name: 'Jab-Cross Fundamentals', description: 'Perfect your 1-2 combination', duration: 180, type: 'technique', instructions: ['Extend jab fully', 'Rotate hips on cross', 'Return to guard quickly'] },
    { id: 3, name: 'Speed Round', description: 'Maximum output, maintain form', duration: 60, type: 'combo', instructions: ['Fast hands', 'Don\'t sacrifice technique', 'Breathe with each punch'] },
    { id: 4, name: 'Defense Master', description: 'Slips, rolls, and counters', duration: 150, type: 'technique', instructions: ['Slip left, slip right', 'Roll under imaginary punches', 'Counter after defense'] },
    { id: 5, name: 'Hooks & Uppercuts', description: 'Power shots from close range', duration: 180, type: 'combo', instructions: ['Keep elbow up on hooks', 'Drive from legs on uppercuts', 'Stay balanced'] },
    { id: 6, name: 'Cool Down', description: 'Breathing and stretching', duration: 120, type: 'cooldown', instructions: ['Deep breaths', 'Shake out arms', 'Reflect on session'] },
  ],
  advanced: [
    { id: 1, name: 'Dynamic Warm-Up', description: 'Shadow boxing with footwork', duration: 150, type: 'warmup', instructions: ['Mix jabs while moving', 'Level changes', 'Constant head movement'] },
    { id: 2, name: '5-Punch Combos', description: 'Jab-cross-hook-cross-uppercut', duration: 210, type: 'combo', instructions: ['Flow between punches', 'Full hip rotation each shot', 'Snap back to guard'] },
    { id: 3, name: 'Pressure Fighting', description: 'Cut angles and close distance', duration: 180, type: 'technique', instructions: ['Step off center line', 'Jab to the body', 'Double up on hooks'] },
    { id: 4, name: 'Counter Punching', description: 'Slip and fire back immediately', duration: 180, type: 'technique', instructions: ['Slip outside the jab', 'Counter with cross', 'Pull counter the right'] },
    { id: 5, name: 'Championship Round', description: 'All out — everything you have', duration: 90, type: 'combo', instructions: ['Volume punching', 'Don\'t let hands drop', 'Dig to body then head'] },
    { id: 6, name: 'Body Shots & Clinch', description: 'Inside fighting fundamentals', duration: 180, type: 'technique', instructions: ['Shovel hook to liver', 'Uppercut in close', 'Control with lead hand'] },
    { id: 7, name: 'Active Recovery', description: 'Cool down with light shadow boxing', duration: 120, type: 'cooldown', instructions: ['Light movement only', 'Focus on breathing', 'Visualize your best combos'] },
  ],
};

const DIFFICULTY_COACH_PROMPT: Record<Difficulty, string> = {
  beginner: 'The user is a beginner. Use simple language, be very encouraging, explain technique basics clearly. Focus on building confidence.',
  intermediate: 'The user is intermediate. Give specific technique corrections, push them to improve, balance encouragement with constructive feedback.',
  advanced: 'The user is advanced. Be demanding, focus on subtle technique details, ring IQ, and fight strategy. Push them to their limits.',
};

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

const STYLE_PRESETS = {
  hype: {
    label: 'Hype Coach',
    prompt: 'Sound like a high-energy ringside coach. Short, punchy, motivational lines.'
  },
  technical: {
    label: 'Technical',
    prompt: 'Be precise and technical. Call out footwork, guard, and hip rotation.'
  },
  zen: {
    label: 'Zen Focus',
    prompt: 'Stay calm and centered. Emphasize breathing, balance, and flow.'
  }
} as const;

type StylePreset = keyof typeof STYLE_PRESETS;

const POST_ROUND_CHECKLIST = [
  'Breathe deep through the nose',
  'Reset guard to cheeks',
  'Loosen shoulders and shake arms',
  'Check stance width + balance',
  'Small sip of water if needed'
];

export default function VoiceCoach({ mistralKey, elevenLabsKey }: VoiceCoachProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [drills, setDrills] = useState<Drill[]>(DRILLS_BY_DIFFICULTY.intermediate);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DRILLS_BY_DIFFICULTY.intermediate[0].duration);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [coachMessage, setCoachMessage] = useState('Ready to train? Enable your camera and press start when you are.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'good' | 'adjust' | 'neutral'>('neutral');
  const [feedbackLabel, setFeedbackLabel] = useState<string | null>(null);
  const [stylePreset, setStylePreset] = useState<StylePreset>('hype');
  const [autoListen, setAutoListen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<boolean[]>(POST_ROUND_CHECKLIST.map(() => false));
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Idle');
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [lastCoachReply, setLastCoachReply] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [ttsEngine, setTtsEngine] = useState<'elevenlabs' | 'native'>('elevenlabs');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoListenTimeoutRef = useRef<number | null>(null);
  const bellContextRef = useRef<AudioContext | null>(null);
  const elevenLabsFailedRef = useRef(false);

  // Load difficulty on mount
  useEffect(() => {
    const d = loadDifficulty();
    setDifficulty(d);
    const selectedDrills = DRILLS_BY_DIFFICULTY[d];
    setDrills(selectedDrills);
    setTimeRemaining(selectedDrills[0].duration);
  }, []);

  const currentDrill = drills[currentDrillIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive && !showChecklist) {
      handleRoundComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining, showChecklist]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  // Frame analysis callback
  const handleFrame = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!isActive || isPaused) return;

    setIsAnalyzing(true);
    // Placeholder analysis (Mistral Vision could go here)
    setTimeout(() => {
      const feedbackPool = [
        { text: 'Guard high, elbows in.', tone: 'adjust' },
        { text: 'Great balance. Keep it!', tone: 'good' },
        { text: 'Chin tucked, eyes forward.', tone: 'adjust' },
        { text: 'Nice bounce and rhythm.', tone: 'good' }
      ] as const;
      const pick = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
      setAnalysisFeedback(pick.text);
      setFeedbackTone(pick.tone);
      setFeedbackLabel(pick.tone === 'good' ? 'Form locked' : 'Adjust form');
      setIsAnalyzing(false);
    }, 900);
  }, [isActive, isPaused]);

  const speakNative = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          resolve();
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha'))
          || voices.find(v => v.lang.startsWith('en') && v.localService)
          || voices.find(v => v.lang.startsWith('en'));
        if (preferred) utterance.voice = preferred;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
        // Safety timeout: resolve after 15s even if speech hangs
        setTimeout(resolve, 15_000);
      } catch {
        resolve();
      }
    });
  }, []);

  // speakText NEVER throws — the coaching flow must never stall on TTS
  const speakText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);

    try {
      // If ElevenLabs already failed, go straight to native TTS
      if (elevenLabsFailedRef.current) {
        await speakNative(text);
        setIsSpeaking(false);
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
          'xi-api-key': elevenLabsKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.35,
            similarity_boost: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;

      try {
        await audioRef.current.play();
      } catch {
        // Autoplay blocked — fall through to native
        throw new Error('Autoplay blocked');
      }

      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };
      // Safety: if onended never fires, release after 30s
      setTimeout(() => setIsSpeaking(false), 30_000);
    } catch {
      // ElevenLabs failed — switch to native TTS for the rest of session
      elevenLabsFailedRef.current = true;
      setTtsEngine('native');
      try {
        await speakNative(text);
      } catch {
        // Native also failed — just continue silently
      }
      setIsSpeaking(false);
    }
  }, [elevenLabsKey, speakNative]);

  const fetchCoachReply = useCallback(async (prompt: string) => {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are a boxing coach. ${STYLE_PRESETS[stylePreset].prompt} ${DIFFICULTY_COACH_PROMPT[difficulty]} Give concise, energetic feedback in 1-2 sentences. Focus on form, breathing, and motivation.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Mistral request failed');
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || 'Keep moving with purpose and stay relaxed in the shoulders.';
  }, [mistralKey, stylePreset, difficulty]);

  const storeSessionRecap = useCallback(() => {
    if (typeof window === 'undefined') return;
    const roundsCompleted = Math.min(
      drills.length,
      currentDrillIndex + (timeRemaining === 0 ? 1 : 0)
    );

    const sessionData = {
      id: Date.now().toString(36),
      seconds: elapsedSeconds,
      roundsCompleted,
      totalRounds: drills.length,
      style: STYLE_PRESETS[stylePreset].label,
      difficulty,
      drills: drills.slice(0, roundsCompleted).map((d) => ({
        name: d.name,
        type: d.type,
        duration: d.duration,
      })),
      topFocus: analysisFeedback || 'Guard, balance, breathing.',
      date: new Date().toISOString(),
    };

    // Save to localStorage history
    saveSession(sessionData);
    // Also keep in sessionStorage for summary page
    sessionStorage.setItem('lastSessionData', JSON.stringify(sessionData));
  }, [analysisFeedback, currentDrillIndex, drills, difficulty, elapsedSeconds, stylePreset, timeRemaining]);

  const playBell = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!bellContextRef.current) {
      const AudioContextImpl = window.AudioContext || (window as any).webkitAudioContext;
      bellContextRef.current = new AudioContextImpl();
    }
    const ctx = bellContextRef.current;
    const now = ctx.currentTime;

    const createTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.start(start);
      osc.stop(start + duration);
    };

    createTone(540, now, 0.35);
    createTone(720, now + 0.08, 0.35);
  }, []);

  const handleRoundComplete = () => {
    playBell();
    if (currentDrillIndex >= drills.length - 1) {
      setSessionComplete(true);
      setIsActive(false);
      setCoachMessage('Excellent work! Session complete. You\'re getting stronger every round.');
      storeSessionRecap();
      return;
    }
    setShowChecklist(true);
    setChecklistState(POST_ROUND_CHECKLIST.map(() => false));
    setIsPaused(true);
  };

  const handleDrillComplete = () => {
    const nextIndex = currentDrillIndex + 1;
    setCurrentDrillIndex(nextIndex);
    setTimeRemaining(drills[nextIndex].duration);
    announceDrill(drills[nextIndex], true);
    playBell();
  };

  const continueAfterChecklist = () => {
    setShowChecklist(false);
    setIsPaused(false);
    handleDrillComplete();
  };

  const announceDrill = (drill: Drill, autoPlay: boolean = false) => {
    setCoachMessage(`${drill.name}. ${drill.description}. Ready? Let's go!`);
    if (autoPlay) {
      speakText(`${drill.name}. ${drill.description}. Ready? Let's go!`);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    playBell();
    const welcome = `Welcome to Fight Corner. I'm watching your form. Let's start with ${currentDrill.name}. Get in your stance.`;
    setCoachMessage(welcome);
    speakText(welcome);
  };

  const skipDrill = () => {
    handleDrillComplete();
  };

  const endSession = () => {
    setIsActive(false);
    setSessionComplete(true);
    setCoachMessage('Session ended early. Great effort! Come back stronger next time.');
    storeSessionRecap();
  };

  const resetSession = () => {
    setSessionComplete(false);
    setIsActive(false);
    setIsPaused(false);
    setCurrentDrillIndex(0);
    setTimeRemaining(drills[0].duration);
    setElapsedSeconds(0);
    setCoachMessage('Ready to train? Enable your camera and press start when you are.');
    setAnalysisFeedback(null);
    setFeedbackTone('neutral');
    setFeedbackLabel(null);
    setShowChecklist(false);
    setChecklistState(POST_ROUND_CHECKLIST.map(() => false));
    setLastTranscript(null);
    setLastCoachReply(null);
    setVoiceStatus('Idle');
  };

  const startRecording = async () => {
    try {
      setRecordingError(null);
      setVoiceStatus('Listening…');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        await processRecording();
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setRecordingError('Microphone access denied. Please allow microphone permissions.');
      setVoiceStatus('Mic blocked');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const processRecording = async () => {
    if (!audioChunksRef.current.length) return;
    setIsProcessingVoice(true);

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const sizeKb = Math.round(audioBlob.size / 1024);
    const placeholderTranscript = `STT placeholder: voice note captured (${sizeKb}kb).`;

    setVoiceStatus('Transcribing…');
    setLastTranscript(placeholderTranscript);

    try {
      setVoiceStatus('Coach thinking…');
      const reply = await fetchCoachReply(`User said: ${placeholderTranscript}. Provide coaching feedback for the current drill: ${currentDrill.name}.`);
      setCoachMessage(reply);
      setLastCoachReply(reply);
      setVoiceStatus('Speaking…');
      await speakText(reply);
      setVoiceStatus('Idle');
    } catch (error) {
      console.error(error);
      setVoiceStatus('Error');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  useEffect(() => {
    if (!autoListen || !isActive || isPaused) return;
    if (isRecording || isProcessingVoice || isSpeaking) return;

    startRecording();
    autoListenTimeoutRef.current = window.setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        stopRecording();
      }
    }, 3500);

    return () => {
      if (autoListenTimeoutRef.current) {
        window.clearTimeout(autoListenTimeoutRef.current);
        autoListenTimeoutRef.current = null;
      }
    };
  }, [autoListen, isActive, isPaused, isRecording, isProcessingVoice, isSpeaking]);

  if (sessionComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-4xl">🥊</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 gradient-text">Session Complete!</h2>
          <p className="text-[color:var(--muted)] mb-6">
            You crushed {drills.length} rounds. The champion's path is built one session at a time.
          </p>
          <div className="space-y-3">
            <button
              onClick={resetSession}
              className="w-full py-3 bg-boxing-red hover:bg-red-600 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
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
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold">Fight Corner Coach</h1>
          <p className="text-xs text-[color:var(--muted)]">AI Boxing Coach with Vision + Voice</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-2 bg-[color:var(--card)] border px-3 py-1 rounded-full ${
            difficulty === 'beginner' ? 'border-emerald-400/40' : difficulty === 'advanced' ? 'border-orange-400/40' : 'border-blue-400/40'
          }`}>
            <span className="text-xs">{difficulty === 'beginner' ? '🥊' : difficulty === 'advanced' ? '🏆' : '🔥'}</span>
            <span className="text-xs text-[color:var(--muted)] capitalize">{difficulty}</span>
          </div>
          <div className="flex items-center gap-2 bg-[color:var(--card)] border border-[color:var(--border)] px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs text-[color:var(--muted)]">{isActive ? 'Coach Active' : 'Standby'}</span>
          </div>
          <div className={`flex items-center gap-2 bg-[color:var(--card)] border px-3 py-1 rounded-full ${ttsEngine === 'native' ? 'border-amber-400/40' : 'border-[color:var(--border)]'}`}>
            <AudioLines className={`w-3 h-3 ${ttsEngine === 'native' ? 'text-amber-400' : 'text-boxing-red'}`} />
            <span className="text-xs text-[color:var(--muted)]">
              {ttsEngine === 'native' ? 'Voice (Browser)' : 'Voice'} {voiceStatus}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Column - Camera */}
        <div className="flex flex-col gap-4">
          {/* Camera Feed */}
          <CameraFeed 
            onFrame={handleFrame} 
            isAnalyzing={isAnalyzing}
            feedbackLabel={feedbackLabel}
            feedbackTone={feedbackTone}
          />

          {/* Analysis Feedback */}
          {analysisFeedback && (
            <div className="glass-card rounded-xl p-4 border-l-4 border-boxing-red">
              <h4 className="text-sm font-semibold text-boxing-red mb-1">Coach Observation:</h4>
              <p className="text-sm text-[color:var(--text)]">{analysisFeedback}</p>
            </div>
          )}
        </div>

        {/* Right Column - Controls & Info */}
        <div className="flex flex-col">
          {/* Coach Message */}
          <div className="glass-card rounded-xl p-4 mb-4 text-center">
            <p className="text-lg text-[color:var(--text)] italic">"{coachMessage}"</p>
          </div>

          {/* Coach Style */}
          <div className="glass-card rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Coach Style</h3>
                <p className="text-xs text-[color:var(--muted)]">Pick the vibe for your prompts</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STYLE_PRESETS) as StylePreset[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setStylePreset(style)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${stylePreset === style ? 'bg-boxing-red border-boxing-red text-white' : 'border-[color:var(--border)] text-[color:var(--muted)] hover:border-boxing-red/60'}`}
                >
                  {STYLE_PRESETS[style].label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Interaction */}
          <div className="glass-card rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Voice Check-in</h3>
                <p className="text-xs text-[color:var(--muted)]">Record a quick note for feedback</p>
              </div>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessingVoice}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isRecording ? 'bg-boxing-red' : 'bg-[color:var(--card)] border border-[color:var(--border)]'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-[color:var(--muted)] mb-2">
              <span>Hands-free auto listen</span>
              <button
                onClick={() => setAutoListen((v) => !v)}
                className={`px-3 py-1 rounded-full border transition-all ${autoListen ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-[color:var(--border)] text-[color:var(--muted)]'}`}
                style={autoListen ? { color: 'var(--success-text)' } : undefined}
              >
                {autoListen ? 'On' : 'Off'}
              </button>
            </div>
            {recordingError && (
              <p className="text-xs text-red-400 mb-2">{recordingError}</p>
            )}
            {lastTranscript && (
              <div className="text-xs text-[color:var(--muted)] mb-2">
                <span className="text-[color:var(--muted)]">Transcript:</span> {lastTranscript}
              </div>
            )}
            {lastCoachReply && (
              <div className="text-xs text-[color:var(--text)]">
                <span className="text-[color:var(--muted)]">Coach:</span> {lastCoachReply}
              </div>
            )}
          </div>

          {/* Voice Visualization */}
          <div className="flex justify-center mb-4">
            <VoiceWave isActive={isSpeaking} />
          </div>

          {/* Timer */}
          {isActive && (
            <div className="flex flex-col items-center mb-4 gap-2">
              <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Round {currentDrillIndex + 1} / {drills.length}</div>
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
              <h4 className="text-sm font-semibold text-[color:var(--muted)] mb-2">Coach Tips:</h4>
              <ul className="space-y-2">
                {currentDrill.instructions.map((tip, idx) => (
                  <li key={idx} className="text-sm text-[color:var(--text)] flex items-start gap-2">
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
                  className="w-14 h-14 rounded-full bg-[color:var(--card)] border border-[color:var(--border)]
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
                  className="w-14 h-14 rounded-full bg-[color:var(--card)] border border-[color:var(--border)]
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

      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-[color:var(--border)]">
            <h3 className="text-xl font-semibold mb-2">Post-round reset</h3>
            <p className="text-sm text-[color:var(--muted)] mb-4">Quick checklist before the next bell.</p>
            <div className="space-y-3 mb-4">
              {POST_ROUND_CHECKLIST.map((item, idx) => (
                <label key={item} className="flex items-center gap-3 text-sm text-[color:var(--text)]">
                  <input
                    type="checkbox"
                    checked={checklistState[idx]}
                    onChange={(e) => {
                      const next = [...checklistState];
                      next[idx] = e.target.checked;
                      setChecklistState(next);
                    }}
                    className="w-4 h-4 rounded border-[color:var(--border)] bg-black/40"
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={continueAfterChecklist}
                className="flex-1 py-2 rounded-lg border border-[color:var(--border)] text-sm"
              >
                Skip
              </button>
              <button
                onClick={continueAfterChecklist}
                className="flex-1 py-2 rounded-lg bg-boxing-red hover:bg-red-600 text-sm font-semibold"
              >
                Next round
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
