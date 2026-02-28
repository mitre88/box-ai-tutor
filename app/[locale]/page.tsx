import Link from 'next/link';
import type { Locale } from '../i18n/messages';
import { isLocale, messages } from '../i18n/messages';
import { Camera, Mic, Brain, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    title: { en: 'Live Camera Analysis', es: 'Análisis en vivo', fr: 'Analyse en direct' },
    desc: {
      en: 'Your form analyzed in real-time through the camera',
      es: 'Tu forma analizada en tiempo real con la cámara',
      fr: 'Votre forme analysée en temps réel par la caméra',
    },
  },
  {
    icon: Brain,
    title: { en: 'Mistral AI Coach', es: 'Coach Mistral AI', fr: 'Coach Mistral AI' },
    desc: {
      en: 'Intelligent coaching powered by Mistral language models',
      es: 'Coaching inteligente con modelos de Mistral',
      fr: 'Coaching intelligent propulsé par les modèles Mistral',
    },
  },
  {
    icon: Mic,
    title: { en: 'Voice Feedback', es: 'Retroalimentación por voz', fr: 'Retour vocal' },
    desc: {
      en: 'Hear your coach speak with ElevenLabs voice synthesis',
      es: 'Escucha a tu coach con síntesis de voz ElevenLabs',
      fr: 'Écoutez votre coach grâce à la synthèse vocale ElevenLabs',
    },
  },
  {
    icon: Zap,
    title: { en: 'Structured Drills', es: 'Rutinas estructuradas', fr: 'Exercices structurés' },
    desc: {
      en: '6-round sessions with warm-up, technique, combos, and cooldown',
      es: 'Sesiones de 6 rondas: calentamiento, técnica, combos y enfriamiento',
      fr: '6 rounds : échauffement, technique, combos et récupération',
    },
  },
];

export default function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const m = messages[locale];

  const hero = {
    en: {
      headline: 'Your AI Boxing Coach',
      sub: 'Real-time form analysis, voice coaching, and structured drills — powered by Mistral AI and ElevenLabs.',
      cta: 'Start Training',
    },
    es: {
      headline: 'Tu Coach de Boxeo con IA',
      sub: 'Análisis de forma en tiempo real, coaching por voz y rutinas estructuradas — con Mistral AI y ElevenLabs.',
      cta: 'Empezar a entrenar',
    },
    fr: {
      headline: 'Votre Coach de Boxe IA',
      sub: 'Analyse de forme en temps réel, coaching vocal et exercices structurés — propulsé par Mistral AI et ElevenLabs.',
      cta: 'Commencer l\'entraînement',
    },
  };

  const h = hero[locale];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-boxing-red/30 bg-boxing-red/10 text-boxing-red text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-boxing-red animate-pulse" />
          Mistral Worldwide Hackathon 2026
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 gradient-text leading-tight">
          {h.headline}
        </h1>
        <p className="text-lg text-[color:var(--muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
          {h.sub}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${locale}/setup`}
            className="px-6 py-3 rounded-xl bg-boxing-red hover:bg-red-600 font-semibold text-white text-lg neon-glow transition-all hover:scale-105"
          >
            {h.cta}
          </Link>
          <Link
            href={`/${locale}/session`}
            className="px-6 py-3 rounded-xl border border-[color:var(--border)] hover:border-boxing-red/50 font-medium transition-all"
          >
            {m.nav.session}
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FEATURES.map((feat) => (
          <div
            key={feat.title.en}
            className="glass-card rounded-xl p-5 flex gap-4 items-start hover:border-boxing-red/30 transition-all"
          >
            <div className="w-10 h-10 shrink-0 rounded-lg bg-boxing-red/15 flex items-center justify-center">
              <feat.icon className="w-5 h-5 text-boxing-red" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{feat.title[locale]}</h3>
              <p className="text-sm text-[color:var(--muted)] leading-relaxed">{feat.desc[locale]}</p>
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-8">
          {locale === 'es' ? 'Cómo funciona' : locale === 'fr' ? 'Comment ça marche' : 'How it works'}
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {[
            { step: '1', en: 'Enter your Mistral API key', es: 'Ingresa tu clave Mistral', fr: 'Entrez votre clé Mistral' },
            { step: '2', en: 'Enable camera & start session', es: 'Activa cámara e inicia sesión', fr: 'Activez la caméra et démarrez' },
            { step: '3', en: 'Train with real-time AI coaching', es: 'Entrena con coaching IA en tiempo real', fr: 'Entraînez-vous avec le coaching IA' },
          ].map((s) => (
            <div key={s.step} className="flex-1 glass-card rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-boxing-red text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                {s.step}
              </div>
              <p className="text-sm font-medium">{s[locale]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
