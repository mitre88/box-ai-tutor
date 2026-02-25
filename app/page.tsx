'use client';

import { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import ProfileSetup from './components/ProfileSetup';
import VoiceCoach from './components/VoiceCoach';
import SessionReport from './components/SessionReport';
import LoadingScreen from './components/LoadingScreen';

interface ApiKeys {
  mistralKey: string;
  elevenLabsKey: string;
}

interface UserProfile {
  name: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  stance: 'orthodox' | 'southpaw';
  focus: 'technique' | 'cardio' | 'power' | 'defense';
}

export default function Home() {
  const [appState, setAppState] = useState<'keys' | 'profile' | 'loading' | 'training' | 'report'>('keys');
  const [apiKeys, setApiKeys] = useState<ApiKeys | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  const handleApiKeySubmit = (keys: ApiKeys) => {
    setApiKeys(keys);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mistralApiKey', keys.mistralKey);
      sessionStorage.setItem('elevenLabsApiKey', keys.elevenLabsKey);
    }
    setAppState('profile');
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState('loading');
    // Simulate loading assets
    setTimeout(() => setAppState('training'), 2000);
  };

  const handleSessionComplete = (data: any) => {
    setSessionData(data);
    setAppState('report');
  };

  const handleNewSession = () => {
    setAppState('training');
  };

  const handleReset = () => {
    setApiKeys(null);
    setUserProfile(null);
    setSessionData(null);
    setAppState('keys');
    sessionStorage.clear();
  };

  return (
    <main>
      {appState === 'keys' && <ApiKeyInput onSubmit={handleApiKeySubmit} />}
      
      {appState === 'profile' && <ProfileSetup onComplete={handleProfileComplete} />}
      
      {appState === 'loading' && <LoadingScreen />}
      
      {appState === 'training' && apiKeys && userProfile && (
        <VoiceCoach 
          mistralKey={apiKeys.mistralKey} 
          elevenLabsKey={apiKeys.elevenLabsKey}
          userProfile={userProfile}
          onSessionComplete={handleSessionComplete}
        />
      )}
      
      {appState === 'report' && sessionData && (
        <SessionReport 
          sessionData={sessionData}
          onNewSession={handleNewSession}
        />
      )}
    </main>
  );
}
