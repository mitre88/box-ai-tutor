'use client';

interface VoiceWaveProps {
  isActive: boolean;
}

export default function VoiceWave({ isActive }: VoiceWaveProps) {
  if (!isActive) {
    return (
      <div className="flex items-end justify-center gap-1 h-16">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gray-600 rounded-full"
            style={{ height: '20%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center gap-1 h-16">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="voice-bar"
          style={{
            height: `${40 + Math.random() * 60}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
