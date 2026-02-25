'use client';

import { useState } from 'react';
import { Trophy, Target, Flame, Clock, TrendingUp, Share2, Download } from 'lucide-react';

interface SessionReportProps {
  sessionData: {
    duration: number;
    drillsCompleted: number;
    punchesThrown: number;
    accuracy: number;
    caloriesBurned: number;
    coachFeedback: string[];
  };
  onNewSession: () => void;
}

export default function SessionReport({ sessionData, onNewSession }: SessionReportProps) {
  const [showShare, setShowShare] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    { icon: Clock, label: 'Duration', value: formatTime(sessionData.duration), color: 'text-blue-400' },
    { icon: Target, label: 'Accuracy', value: `${sessionData.accuracy}%`, color: 'text-green-400' },
    { icon: Trophy, label: 'Drills', value: sessionData.drillsCompleted, color: 'text-yellow-400' },
    { icon: Flame, label: 'Calories', value: sessionData.caloriesBurned, color: 'text-orange-400' },
  ];

  const getPerformanceGrade = () => {
    if (sessionData.accuracy >= 90) return { grade: 'S', label: 'Elite', color: 'text-purple-400' };
    if (sessionData.accuracy >= 80) return { grade: 'A', label: 'Excellent', color: 'text-green-400' };
    if (sessionData.accuracy >= 70) return { grade: 'B', label: 'Good', color: 'text-blue-400' };
    if (sessionData.accuracy >= 60) return { grade: 'C', label: 'Average', color: 'text-yellow-400' };
    return { grade: 'D', label: 'Keep Training', color: 'text-orange-400' };
  };

  const performance = getPerformanceGrade();

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-boxing-red to-purple-600 flex items-center justify-center">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
        <p className="text-gray-400">Great work, champion. Here's your performance breakdown.</p>
      </header>

      {/* Grade Card */}
      <div className="glass-card rounded-2xl p-6 mb-6 text-center">
        <div className={`text-7xl font-black mb-2 ${performance.color}`}>
          {performance.grade}
        </div>
        <div className="text-xl font-semibold text-white">{performance.label}</div>
        <div className="text-sm text-gray-400 mt-1">
          Based on form accuracy and completion
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Coach Feedback */}
      <div className="glass-card rounded-xl p-4 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Coach Feedback
        </h3>
        <ul className="space-y-2">
          {sessionData.coachFeedback.map((feedback, idx) => (
            <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
              <span className="text-boxing-red mt-0.5">•</span>
              {feedback}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onNewSession}
          className="w-full py-3 bg-boxing-red hover:bg-red-600 rounded-lg font-semibold
                     flex items-center justify-center gap-2 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Start New Session
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setShowShare(!showShare)}
            className="flex-1 py-3 bg-dark-card border border-white/10 hover:border-white/30 
                       rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            className="flex-1 py-3 bg-dark-card border border-white/10 hover:border-white/30 
                       rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Save Report
          </button>
        </div>
      </div>

      {/* Share Options */}
      {showShare && (
        <div className="mt-4 p-4 glass-card rounded-xl">
          <p className="text-sm text-gray-400 mb-3">Share your progress:</p>
          <div className="flex gap-2">
            {['Twitter', 'Instagram', 'Copy Link'].map((platform) => (
              <button
                key={platform}
                className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <p className="mt-6 text-center text-sm text-gray-500 italic">
        "The fight is won or lost far away from witnesses - behind the lines, in the gym." 
        <span className="text-gray-400">— Muhammad Ali</span>
      </p>
    </div>
  );
}
