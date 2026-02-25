export type ApiKeys = {
  mistralKey: string;
  elevenLabsKey: string;
};

const MISTRAL_KEY = 'mistralApiKey';
const ELEVEN_KEY = 'elevenLabsApiKey';

export function saveKeys(keys: ApiKeys) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(MISTRAL_KEY, keys.mistralKey);
  sessionStorage.setItem(ELEVEN_KEY, keys.elevenLabsKey);
}

export function loadKeys(): ApiKeys | null {
  if (typeof window === 'undefined') return null;
  const mistralKey = sessionStorage.getItem(MISTRAL_KEY) || '';
  const elevenLabsKey = sessionStorage.getItem(ELEVEN_KEY) || '';
  if (!mistralKey || !elevenLabsKey) return null;
  return { mistralKey, elevenLabsKey };
}

export function clearKeys() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(MISTRAL_KEY);
  sessionStorage.removeItem(ELEVEN_KEY);
}
