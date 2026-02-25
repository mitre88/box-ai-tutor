'use client';

interface SessionTimerProps {
  seconds: number;
}

export default function SessionTimer({ seconds }: SessionTimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="text-center">
      <div className={`text-6xl font-mono font-bold ${
        seconds < 10 ? 'text-boxing-red' : 'text-white'
      }`}>
        {String(minutes).padStart(2, '0')}:
        {String(remainingSeconds).padStart(2, '0')}
      </div>
    </div>
  );
}
