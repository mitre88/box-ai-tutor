export const ELEVENLABS_API_KEY = 'sk_370bf1b35c49dd32c9521da9086f9c77dfd7e0c8da9d6343';

export type AiProvider = 'openai' | 'anthropic' | 'mistral' | 'groq' | 'openrouter' | 'gemini';

export const AI_PROVIDERS: { id: AiProvider; label: string; hint: string; example: string }[] = [
  { id: 'openai',      label: 'OpenAI',       hint: 'sk-...',             example: 'sk-proj-...' },
  { id: 'anthropic',   label: 'Anthropic',    hint: 'sk-ant-...',         example: 'sk-ant-api03-...' },
  { id: 'mistral',     label: 'Mistral',      hint: 'Mistral API key',    example: 'Standard or hackathon UUID' },
  { id: 'groq',        label: 'Groq',         hint: 'gsk_...',            example: 'gsk_...' },
  { id: 'openrouter',  label: 'OpenRouter',   hint: 'sk-or-...',          example: 'sk-or-v1-...' },
  { id: 'gemini',      label: 'Google Gemini', hint: 'AIza...',           example: 'AIzaSy...' },
];

export type ApiKeys = {
  aiKey: string;
  aiProvider: AiProvider;
  elevenLabsKey: string;
};

const AI_KEY     = 'boxai_aiKey';
const AI_PROVIDER = 'boxai_aiProvider';
// Legacy key for backward compat
const MISTRAL_KEY_LEGACY = 'mistralApiKey';

export function saveKeys(keys: { aiKey: string; aiProvider: AiProvider }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AI_KEY, keys.aiKey);
  localStorage.setItem(AI_PROVIDER, keys.aiProvider);
}

export function loadKeys(): ApiKeys | null {
  if (typeof window === 'undefined') return null;

  // New format
  let aiKey = localStorage.getItem(AI_KEY) || '';
  let aiProvider = (localStorage.getItem(AI_PROVIDER) as AiProvider) || null;

  // Migrate legacy mistral key
  if (!aiKey) {
    const legacy = localStorage.getItem(MISTRAL_KEY_LEGACY) || '';
    if (legacy) {
      aiKey = legacy;
      aiProvider = 'mistral';
      // Persist migration
      localStorage.setItem(AI_KEY, aiKey);
      localStorage.setItem(AI_PROVIDER, 'mistral');
    }
  }

  if (!aiKey || !aiProvider) return null;
  return { aiKey, aiProvider, elevenLabsKey: ELEVENLABS_API_KEY };
}

export function clearKeys() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AI_KEY);
  localStorage.removeItem(AI_PROVIDER);
  localStorage.removeItem(MISTRAL_KEY_LEGACY);
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
