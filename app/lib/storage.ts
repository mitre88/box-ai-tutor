export type ApiKeys = {
  mistralKey: string;
  elevenLabsKey: string;
};

const MISTRAL_KEY = 'mistralApiKey';
const ELEVEN_KEY = 'elevenLabsApiKey';

export function saveKeys(keys: ApiKeys) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MISTRAL_KEY, keys.mistralKey);
  localStorage.setItem(ELEVEN_KEY, keys.elevenLabsKey);
}

export function loadKeys(): ApiKeys | null {
  if (typeof window === 'undefined') return null;
  const mistralKey = localStorage.getItem(MISTRAL_KEY) || '';
  const elevenLabsKey = localStorage.getItem(ELEVEN_KEY) || '';
  if (!mistralKey || !elevenLabsKey) return null;
  return { mistralKey, elevenLabsKey };
}

export function clearKeys() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MISTRAL_KEY);
  localStorage.removeItem(ELEVEN_KEY);
}
