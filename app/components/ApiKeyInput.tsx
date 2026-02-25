'use client';

import { useState } from 'react';
import { Key, ArrowRight } from 'lucide-react';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export default function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    // Validate key format (basic check)
    if (apiKey.startsWith('sk-') && apiKey.length > 20) {
      onSubmit(apiKey);
    } else {
      alert('Please enter a valid Mistral API key');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-boxing-red/20 flex items-center justify-center">
            <Key className="w-8 h-8 text-boxing-red" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Fight Corner</h1>
          <p className="text-gray-400 text-sm">
            Enter your Mistral API key to start training with your AI coach
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Mistral API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 rounded-lg bg-dark-card border border-white/10 
                         focus:border-boxing-red focus:outline-none transition-colors
                         text-white placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !apiKey.trim()}
            className="w-full py-3 px-4 bg-boxing-red hover:bg-red-600 rounded-lg
                       font-semibold flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {isLoading ? 'Connecting...' : 'Start Training'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Your API key is stored locally and never sent to our servers
        </p>
      </div>
    </div>
  );
}
