'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { loadHistory } from '../../lib/storage';
import type { SessionRecord } from '../../lib/storage';
import { Clock, Target, Flame, Trophy, Award, RotateCcw, Share2, CheckCircle2, History } from 'lucide-react';

interface DrillData {
  name: string;
  type: 'warmup' | 'technique' | 'combo' | 'cooldown';
  duration: number;
}

interface SessionData {
  id?: string;
  seconds: number;
  roundsCompleted: number;
  totalRounds: number;
  style: string;
  difficulty?: string;
  drills: DrillData[];
  topFocus: string;
  date: string;
}

const DRILL_TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  warmup: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Warm-up' },
  technique: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Technique' },
  combo: { bg: 'bg-boxing-red/15', text: 'text-boxing-red', label: 'Combo' },
  cooldown: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Cool-down' },
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function getAchievements(data: SessionData): { icon: typeof Trophy; label: string; desc: string; color: string }[] {
  const badges: { icon: typeof Trophy; label: string; desc: string; color: string }[] = [];

  if (data.roundsCompleted >= data.totalRounds) {
    badges.push({ icon: Trophy, label: 'Full Session', desc: 'Completed all rounds', color: 'text-yellow-400' });
  }
  if (data.seconds >= 600) {
    badges.push({ icon: Flame, label: '10+ Minutes', desc: 'Trained for over 10 minutes', color: 'text-orange-400' });
  }
  if (data.roundsCompleted >= 3) {
    badges.push({ icon: Target, label: 'Half Way', desc: 'Completed 3+ rounds', color: 'text-blue-400' });
  }
  if (data.drills.some(d => d.type === 'combo')) {
    badges.push({ icon: Award, label: 'Combo Fighter', desc: 'Completed combo drills', color: 'text-boxing-red' });
  }

  return badges;
}

export default function SummaryPage() {
  const { locale, messages } = useI18n();
  const [data, setData] = useState<SessionData | null>(null);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('lastSessionData');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        // fallback to legacy
      }
    }
    setHistory(loadHistory());
  }, []);

  const handleCopy = async () => {
    if (!data) return;
    const recap = [
      `Box AI Tutor - Session Recap`,
      `Date: ${new Date(data.date).toLocaleDateString()}`,
      `Duration: ${formatTime(data.seconds)}`,
      `Rounds: ${data.roundsCompleted} / ${data.totalRounds}`,
      `Style: ${data.style}`,
      `Focus: ${data.topFocus}`,
      ``,
      `Drills completed:`,
      ...data.drills.map((d, i) => `  ${i + 1}. ${d.name} (${DRILL_TYPE_COLORS[d.type]?.label || d.type})`),
      ``,
      `Powered by Mistral AI + ElevenLabs`,
    ].join('\n');
    await navigator.clipboard.writeText(recap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Empty state — no current session data
  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{messages.summary.title}</h1>
          <p className="text-[color:var(--muted)]">{messages.summary.subtitle}</p>
        </div>
        <div className="glass-card rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
            <Clock className="w-7 h-7 text-[color:var(--muted)]" />
          </div>
          <p className="text-[color:var(--muted)]">
            {locale === 'es' ? 'No hay sesión reciente. Completa una sesión de entrenamiento para ver tus resultados.' :
             locale === 'fr' ? 'Aucune session récente. Terminez une session pour voir vos résultats.' :
             'No recent session. Complete a training session to see your results here.'}
          </p>
          <Link
            href={`/${locale}/session`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-boxing-red hover:bg-red-600 font-semibold text-white transition-all hover:scale-105"
          >
            {locale === 'es' ? 'Iniciar sesión' : locale === 'fr' ? 'Démarrer une session' : 'Start a session'}
          </Link>
        </div>

        {/* Show history even without current session */}
        {history.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-[color:var(--muted)]" />
              <h3 className="text-sm font-semibold">
                {locale === 'es' ? 'Sesiones anteriores' : locale === 'fr' ? 'Sessions précédentes' : 'Past Sessions'}
              </h3>
            </div>
            <div className="space-y-3">
              {history.slice(0, 5).map((session, i) => (
                <div key={session.id || i} className="flex items-center justify-between p-3 rounded-lg border border-[color:var(--border)] bg-white/[0.02]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <span className="text-xs">{session.difficulty === 'beginner' ? '🥊' : session.difficulty === 'advanced' ? '🏆' : '🔥'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{formatTime(session.seconds)} — {session.roundsCompleted}/{session.totalRounds} rounds</p>
                      <p className="text-xs text-[color:var(--muted)]">
                        {new Date(session.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[color:var(--muted)] shrink-0 ml-3">{session.style}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const achievements = getAchievements(data);
  const completionPercent = Math.round((data.roundsCompleted / data.totalRounds) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 gradient-text">
            {locale === 'es' ? 'Resumen de sesión' : locale === 'fr' ? 'Résumé de session' : 'Session Recap'}
          </h1>
          <p className="text-sm text-[color:var(--muted)]">
            {new Date(data.date).toLocaleDateString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--border)] hover:border-boxing-red/40 text-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            {copied ? (locale === 'es' ? 'Copiado!' : locale === 'fr' ? 'Copié!' : 'Copied!') : (locale === 'es' ? 'Compartir' : locale === 'fr' ? 'Partager' : 'Share')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-boxing-red" />
          <p className="text-2xl font-bold">{formatTime(data.seconds)}</p>
          <p className="text-xs text-[color:var(--muted)] mt-1">
            {locale === 'es' ? 'Duración' : locale === 'fr' ? 'Durée' : 'Duration'}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold">{data.roundsCompleted}<span className="text-sm text-[color:var(--muted)]">/{data.totalRounds}</span></p>
          <p className="text-xs text-[color:var(--muted)] mt-1">Rounds</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Flame className="w-5 h-5 mx-auto mb-2 text-orange-400" />
          <p className="text-2xl font-bold">{data.style}</p>
          <p className="text-xs text-[color:var(--muted)] mt-1">
            {locale === 'es' ? 'Estilo' : locale === 'fr' ? 'Style' : 'Style'}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Award className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold">{completionPercent}%</p>
          <p className="text-xs text-[color:var(--muted)] mt-1">
            {locale === 'es' ? 'Completado' : locale === 'fr' ? 'Complété' : 'Complete'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">
            {locale === 'es' ? 'Progreso de sesión' : locale === 'fr' ? 'Progression' : 'Session Progress'}
          </h3>
          <span className="text-xs text-[color:var(--muted)]">{completionPercent}%</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-boxing-red to-red-500 transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Drills Breakdown */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">
          {locale === 'es' ? 'Desglose de rounds' : locale === 'fr' ? 'Détail des rounds' : 'Round Breakdown'}
        </h3>
        <div className="space-y-3">
          {data.drills.map((drill, i) => {
            const typeInfo = DRILL_TYPE_COLORS[drill.type] || DRILL_TYPE_COLORS.technique;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{drill.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.bg} ${typeInfo.text}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-[color:var(--muted)]">{formatTime(drill.duration)}</p>
                </div>
              </div>
            );
          })}

          {/* Remaining rounds (not completed) */}
          {data.roundsCompleted < data.totalRounds && (
            Array.from({ length: data.totalRounds - data.roundsCompleted }).map((_, i) => (
              <div key={`remaining-${i}`} className="flex items-center gap-3 opacity-40">
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <span className="text-xs text-[color:var(--muted)]">{data.roundsCompleted + i + 1}</span>
                </div>
                <span className="text-sm text-[color:var(--muted)]">
                  {locale === 'es' ? 'No completado' : locale === 'fr' ? 'Non complété' : 'Not completed'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">
            {locale === 'es' ? 'Logros' : locale === 'fr' ? 'Réussites' : 'Achievements'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((badge) => (
              <div key={badge.label} className="text-center p-3 rounded-lg bg-white/5 border border-[color:var(--border)]">
                <badge.icon className={`w-6 h-6 mx-auto mb-2 ${badge.color}`} />
                <p className="text-xs font-semibold">{badge.label}</p>
                <p className="text-[10px] text-[color:var(--muted)] mt-0.5">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Focus */}
      <div className="glass-card rounded-xl p-5 border-l-4 border-boxing-red">
        <h3 className="text-sm font-semibold text-boxing-red mb-2">
          {locale === 'es' ? 'Enfoque del coach' : locale === 'fr' ? 'Point du coach' : 'Coach Focus'}
        </h3>
        <p className="text-sm text-[color:var(--text)] leading-relaxed">{data.topFocus}</p>
      </div>

      {/* Session History */}
      {history.length > 1 && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[color:var(--muted)]" />
            <h3 className="text-sm font-semibold">
              {locale === 'es' ? 'Historial de sesiones' : locale === 'fr' ? 'Historique des sessions' : 'Session History'}
            </h3>
          </div>
          <div className="space-y-3">
            {history.slice(0, 10).map((session, i) => (
              <div
                key={session.id || i}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  i === 0 ? 'border-boxing-red/30 bg-boxing-red/5' : 'border-[color:var(--border)] bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[color:var(--muted)]">
                      {session.difficulty === 'beginner' ? '🥊' : session.difficulty === 'advanced' ? '🏆' : '🔥'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {formatTime(session.seconds)} — {session.roundsCompleted}/{session.totalRounds} rounds
                    </p>
                    <p className="text-xs text-[color:var(--muted)]">
                      {new Date(session.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {session.difficulty && <span className="ml-2 capitalize">{session.difficulty}</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-xs font-medium text-[color:var(--muted)]">{session.style}</p>
                  {session.roundsCompleted >= session.totalRounds && (
                    <span className="text-[10px] text-yellow-400 font-semibold">Complete</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${locale}/session`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-boxing-red hover:bg-red-600 font-semibold text-white transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          {locale === 'es' ? 'Nueva sesión' : locale === 'fr' ? 'Nouvelle session' : 'New Session'}
        </Link>
        <Link
          href={`/${locale}/setup`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[color:var(--border)] hover:border-boxing-red/40 transition-all"
        >
          {messages.summary.backToSetup}
        </Link>
      </div>
    </div>
  );
}
