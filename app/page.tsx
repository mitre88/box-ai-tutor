'use client';

import { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import VoiceCoach from './components/VoiceCoach';

interface ApiKeys {
  mistralKey: string;
  elevenLabsKey: string;
}

export default function Home() {
  const [apiKeys, setApiKeys] = useState<ApiKeys | null>(null);

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
