'use client';

interface Drill {
  id: number;
  name: string;
  description: string;
  duration: number;
  type: 'warmup' | 'technique' | 'combo' | 'cooldown';
}

interface DrillCardProps {
  drill: Drill;
  isActive: boolean;
  progress: number;
}

const typeColors = {
  warmup: 'text-yellow-400',
  technique: 'text-blue-400',
  combo: 'text-boxing-red',
  cooldown: 'text-green-400',
};

const typeLabels = {
  warmup: 'Warm Up',
  technique: 'Technique',
  combo: 'Combination',
  cooldown: 'Cool Down',
};

export default function DrillCard({ drill, isActive, progress }: DrillCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 transition-all ${
      isActive ? 'border-boxing-red/50' : ''
    }`}>
      {/* Progress bar */}
      {isActive && (
        <div className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-boxing-red transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Type badge */}
      <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${typeColors[drill.type]}`}>
        {typeLabels[drill.type]}
      </div>

      {/* Drill name */}
      <h3 className="text-2xl font-bold mb-2">{drill.name}</h3>
      
      {/* Description */}
      <p className="text-gray-400 text-sm mb-4">{drill.description}</p>

      {/* Duration */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
        </svg>
        {Math.floor(drill.duration / 60)}:{String(drill.duration % 60).padStart(2, '0')}
      </div>
    </div>
  );
}
