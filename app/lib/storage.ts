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

// Difficulty
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
const DIFFICULTY_KEY = 'boxai_difficulty';

export function saveDifficulty(d: Difficulty) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DIFFICULTY_KEY, d);
}

export function loadDifficulty(): Difficulty {
  if (typeof window === 'undefined') return 'intermediate';
  return (localStorage.getItem(DIFFICULTY_KEY) as Difficulty) || 'intermediate';
}

// Session history
export interface SessionRecord {
  id: string;
  seconds: number;
  roundsCompleted: number;
  totalRounds: number;
  style: string;
  difficulty: Difficulty;
  drills: { name: string; type: string; duration: number }[];
  topFocus: string;
  date: string;
}

const HISTORY_KEY = 'boxai_history';

export function saveSession(session: SessionRecord) {
  if (typeof window === 'undefined') return;
  const history = loadHistory();
  history.unshift(session);
  // Keep last 20 sessions
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

export function loadHistory(): SessionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}
