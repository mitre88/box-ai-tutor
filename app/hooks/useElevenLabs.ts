// hooks/useElevenLabs.ts
// TODO: @Mi_codex_bot - Implementar integración completa

interface SpeakOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export function useElevenLabs(apiKey: string) {
  const speak = async (text: string, options?: SpeakOptions): Promise<void> => {
    // TODO: Implementar llamada a ElevenLabs API
    // 1. POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
    // 2. Obtener audio blob
    // 3. Reproducir con Audio()
    
    console.log('[ElevenLabs] Would speak:', text);
    
    // Placeholder - simular delay
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const stop = () => {
    // TODO: Detener reproducción actual
    console.log('[ElevenLabs] Stop speaking');
  };

  return { speak, stop };
}

// Voces recomendadas para coach de boxeo:
// - '21m00Tcm4TlvDq8ikWAM' (Rachel - authoritative)
// - 'AZnzlk1XvdvUeBnXmlld' (Domi - energetic)
// - 'EXAVITQu4vr4xnSDxMaL' (Bella - motivating)
