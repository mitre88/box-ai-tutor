'use client';

import { useState } from 'react';
import { Settings, User, Ruler, Target } from 'lucide-react';

interface UserProfile {
  name: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  stance: 'orthodox' | 'southpaw';
  focus: 'technique' | 'cardio' | 'power' | 'defense';
}

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    experience: 'beginner',
    stance: 'orthodox',
    focus: 'technique'
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(profile);
  };

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner', desc: 'New to boxing' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Some training' },
    { value: 'advanced', label: 'Advanced', desc: 'Regular boxer' },
    { value: 'pro', label: 'Professional', desc: 'Competing/Coaching' },
  ];

  const stanceOptions = [
    { value: 'orthodox', label: 'Orthodox', desc: 'Left hand forward' },
    { value: 'southpaw', label: 'Southpaw', desc: 'Right hand forward' },
  ];

  const focusOptions = [
    { value: 'technique', label: 'Technique', desc: 'Form & fundamentals' },
    { value: 'cardio', label: 'Cardio', desc: 'Stamina & endurance' },
    { value: 'power', label: 'Power', desc: 'Strength & explosiveness' },
    { value: 'defense', label: 'Defense', desc: 'Movement & counters' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? 'bg-boxing-red' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-boxing-red/20 flex items-center justify-center">
                <User className="w-8 h-8 text-boxing-red" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome, Fighter</h2>
              <p className="text-gray-400">Let's personalize your training</p>
            </div>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-dark-card border border-white/10 
                         focus:border-boxing-red focus:outline-none text-white"
            />
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-boxing-red/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-boxing-red" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Experience Level</h2>
              <p className="text-gray-400">We'll adjust the intensity</p>
            </div>
            {experienceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfile({ ...profile, experience: opt.value as any })}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  profile.experience === opt.value
                    ? 'border-boxing-red bg-boxing-red/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-sm text-gray-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Stance */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-boxing-red/20 flex items-center justify-center">
                <Ruler className="w-8 h-8 text-boxing-red" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Stance</h2>
              <p className="text-gray-400">Which is your dominant hand?</p>
            </div>
            {stanceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfile({ ...profile, stance: opt.value as any })}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  profile.stance === opt.value
                    ? 'border-boxing-red bg-boxing-red/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-sm text-gray-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Focus */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-boxing-red/20 flex items-center justify-center">
                <Settings className="w-8 h-8 text-boxing-red" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Training Focus</h2>
              <p className="text-gray-400">What do you want to improve?</p>
            </div>
            {focusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfile({ ...profile, focus: opt.value as any })}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  profile.focus === opt.value
                    ? 'border-boxing-red bg-boxing-red/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-sm text-gray-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <button
          onClick={handleNext}
          disabled={step === 1 && !profile.name.trim()}
          className="w-full mt-8 py-3 bg-boxing-red hover:bg-red-600 rounded-lg font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {step === 4 ? 'Start Training' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
