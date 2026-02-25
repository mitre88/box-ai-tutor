'use client';

import { useState, useEffect } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import VoiceCoach from './components/VoiceCoach';

interface ApiKeys {
  mistralKey: string;
  elevenLabsKey: string;
}

export default function Home() {
  const [apiKeys, setApiKeys] = useState<ApiKeys | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedMistral = sessionStorage.getItem('mistralApiKey') || process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
    const storedEleven = sessionStorage.getItem('elevenLabsApiKey') || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';

    if (storedMistral && storedEleven) {
      setApiKeys({ mistralKey: storedMistral, elevenLabsKey: storedEleven });
    }
  }, []);

  const handleApiKeySubmit = (keys: ApiKeys) => {
    setApiKeys(keys);
    // Store in session storage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mistralApiKey', keys.mistralKey);
      sessionStorage.setItem('elevenLabsApiKey', keys.elevenLabsKey);
    }
  };

  return (
    <main>
      {!apiKeys ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : (
        <VoiceCoach 
          mistralKey={apiKeys.mistralKey} 
          elevenLabsKey={apiKeys.elevenLabsKey}
        />
      )}
    </main>
  );
}
