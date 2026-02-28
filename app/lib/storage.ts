export const ELEVENLABS_API_KEY = 'sk_370bf1b35c49dd32c9521da9086f9c77dfd7e0c8da9d6343';

export type ApiKeys = {
  mistralKey: string;
  elevenLabsKey: string;
};

const MISTRAL_KEY = 'mistralApiKey';

export function saveKeys(keys: { mistralKey: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MISTRAL_KEY, keys.mistralKey);
}

export function loadKeys(): ApiKeys | null {
  if (typeof window === 'undefined') return null;
  const mistralKey = localStorage.getItem(MISTRAL_KEY) || '';
  if (!mistralKey) return null;
  return { mistralKey, elevenLabsKey: ELEVENLABS_API_KEY };
}

export function clearKeys() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MISTRAL_KEY);
}
