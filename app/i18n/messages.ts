export type Locale = 'en' | 'es' | 'fr';

export const locales: Locale[] = ['en', 'es', 'fr'];
export const defaultLocale: Locale = 'en';

export type Messages = {
  appName: string;
  nav: { setup: string; camera: string; session: string; summary: string };
  setup: {
    title: string;
    subtitle: string;
    mistralLabel: string;
    elevenLabel: string;
    elevenPreConfigured: string;
    mistralHint: string;
    elevenHint: string;
    testKeys: string;
    testing: string;
    saveAndContinue: string;
    success: string;
    error: string;
  };
  camera: { title: string; subtitle: string; startSession: string };
  session: {
    title: string;
    subtitle: string;
    start: string;
    stop: string;
    endAndSummary: string;
  };
  summary: { title: string; subtitle: string; backToSetup: string };
  common: { missingKeys: string; locale: string };
};

export const messages: Record<Locale, Messages> = {
  en: {
    appName: 'Box AI Tutor',
    nav: {
      setup: 'Key setup',
      camera: 'Camera',
      session: 'Session',
      summary: 'Summary',
    },
    setup: {
      title: 'Key setup',
      subtitle: 'Enter your Mistral API key to start coaching. Voice is already configured.',
      mistralLabel: 'Mistral API key',
      elevenLabel: 'ElevenLabs Voice',
      elevenPreConfigured: 'Pre-configured and ready',
      mistralHint: 'Paste your Mistral key here',
      elevenHint: '',
      testKeys: 'Test key',
      testing: 'Testing…',
      saveAndContinue: 'Save & start training',
      success: 'Mistral key is valid.',
      error: 'Could not validate the key.',
    },
    camera: {
      title: 'Camera preview',
      subtitle: 'Allow camera access to preview your stance.',
      startSession: 'Start session',
    },
    session: {
      title: 'Session',
      subtitle: 'Start/stop your training session.',
      start: 'Start',
      stop: 'Stop',
      endAndSummary: 'End & view summary',
    },
    summary: {
      title: 'Summary',
      subtitle: 'Your session results.',
      backToSetup: 'Back to setup',
    },
    common: {
      missingKeys: 'Mistral key not set. Please go to setup.',
      locale: 'Language',
    },
  },
  es: {
    appName: 'Box AI Tutor',
    nav: {
      setup: 'Configurar clave',
      camera: 'Cámara',
      session: 'Sesión',
      summary: 'Resumen',
    },
    setup: {
      title: 'Configuración',
      subtitle: 'Ingresa tu clave de Mistral para comenzar. La voz ya está configurada.',
      mistralLabel: 'Clave API de Mistral',
      elevenLabel: 'Voz ElevenLabs',
      elevenPreConfigured: 'Pre-configurada y lista',
      mistralHint: 'Pega tu clave de Mistral aquí',
      elevenHint: '',
      testKeys: 'Probar clave',
      testing: 'Probando…',
      saveAndContinue: 'Guardar y entrenar',
      success: 'La clave de Mistral es válida.',
      error: 'No se pudo validar la clave.',
    },
    camera: {
      title: 'Vista previa de cámara',
      subtitle: 'Permite el acceso a la cámara para ver tu postura.',
      startSession: 'Iniciar sesión',
    },
    session: {
      title: 'Sesión',
      subtitle: 'Inicia/detén tu sesión de entrenamiento.',
      start: 'Iniciar',
      stop: 'Detener',
      endAndSummary: 'Terminar y ver resumen',
    },
    summary: {
      title: 'Resumen',
      subtitle: 'Resultados de tu sesión.',
      backToSetup: 'Volver a configuración',
    },
    common: {
      missingKeys: 'Falta la clave de Mistral. Ve a configuración.',
      locale: 'Idioma',
    },
  },
  fr: {
    appName: 'Box AI Tutor',
    nav: {
      setup: 'Configuration',
      camera: 'Caméra',
      session: 'Session',
      summary: 'Résumé',
    },
    setup: {
      title: 'Configuration',
      subtitle: 'Entrez votre clé Mistral pour commencer. La voix est déjà configurée.',
      mistralLabel: 'Clé API Mistral',
      elevenLabel: 'Voix ElevenLabs',
      elevenPreConfigured: 'Pré-configurée et prête',
      mistralHint: 'Collez votre clé Mistral ici',
      elevenHint: '',
      testKeys: 'Tester la clé',
      testing: 'Test…',
      saveAndContinue: 'Enregistrer et commencer',
      success: 'La clé Mistral est valide.',
      error: 'Impossible de valider la clé.',
    },
    camera: {
      title: 'Aperçu caméra',
      subtitle: 'Autorisez la caméra pour prévisualiser votre posture.',
      startSession: 'Démarrer la session',
    },
    session: {
      title: 'Session',
      subtitle: 'Démarrer/arrêter votre session d\'entraînement.',
      start: 'Démarrer',
      stop: 'Arrêter',
      endAndSummary: 'Terminer et voir le résumé',
    },
    summary: {
      title: 'Résumé',
      subtitle: 'Résultats de votre session.',
      backToSetup: 'Retour à la configuration',
    },
    common: {
      missingKeys: 'Clé Mistral manquante. Allez à la configuration.',
      locale: 'Langue',
    },
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
