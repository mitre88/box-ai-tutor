'use client';

import { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import VoiceCoach from './components/VoiceCoach';

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    // Store in session storage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mistralApiKey', key);
    }
  };

  // Check for existing key on mount
  if (typeof window !== 'undefined' && !apiKey) {
    const stored = sessionStorage.getItem('mistralApiKey');
    if (stored) {
      setApiKey(stored);
      return null; // Will re-render with key
    }
  }

  return (
    <main>
      {!apiKey ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : (
        <VoiceCoach apiKey={apiKey} />
      )}
    </main>
  );
}
