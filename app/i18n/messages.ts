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
      subtitle: 'Enter your API keys. They stay in your browser (session storage).',
      mistralLabel: 'Mistral API key',
      elevenLabel: 'ElevenLabs API key',
      mistralHint: 'Paste your key from Mistral (formats vary)',
      elevenHint: 'Paste your key from ElevenLabs',
      testKeys: 'Test keys',
      testing: 'Testing…',
      saveAndContinue: 'Save & continue',
      success: 'Keys look valid.',
      error: 'Could not validate the keys.',
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
      subtitle: 'Stub: session summary will appear here.',
      backToSetup: 'Back to setup',
    },
    common: {
      missingKeys: 'Missing keys. Please go to setup.',
      locale: 'Language',
    },
  },
  es: {
    appName: 'Box AI Tutor',
    nav: {
      setup: 'Configurar claves',
      camera: 'Cámara',
      session: 'Sesión',
      summary: 'Resumen',
    },
    setup: {
      title: 'Configuración de claves',
      subtitle: 'Ingresa tus claves API. Se quedan en tu navegador (session storage).',
      mistralLabel: 'Clave API de Mistral',
      elevenLabel: 'Clave API de ElevenLabs',
      mistralHint: 'Pega tu clave de Mistral (el formato varía)',
      elevenHint: 'Pega tu clave de ElevenLabs',
      testKeys: 'Probar claves',
      testing: 'Probando…',
      saveAndContinue: 'Guardar y continuar',
      success: 'Las claves parecen válidas.',
      error: 'No se pudieron validar las claves.',
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
      subtitle: 'Stub: el resumen de la sesión aparecerá aquí.',
      backToSetup: 'Volver a configuración',
    },
    common: {
      missingKeys: 'Faltan claves. Ve a configuración.',
      locale: 'Idioma',
    },
  },
  fr: {
    appName: 'Box AI Tutor',
    nav: {
      setup: 'Configuration des clés',
      camera: 'Caméra',
      session: 'Session',
      summary: 'Résumé',
    },
    setup: {
      title: 'Configuration des clés',
      subtitle: 'Saisissez vos clés API. Elles restent dans votre navigateur (session storage).',
      mistralLabel: 'Clé API Mistral',
      elevenLabel: 'Clé API ElevenLabs',
      mistralHint: 'Collez votre clé Mistral (le format varie)',
      elevenHint: 'Collez votre clé ElevenLabs',
      testKeys: 'Tester les clés',
      testing: 'Test…',
      saveAndContinue: 'Enregistrer et continuer',
      success: 'Les clés semblent valides.',
      error: 'Impossible de valider les clés.',
    },
    camera: {
      title: 'Aperçu caméra',
      subtitle: 'Autorisez la caméra pour prévisualiser votre posture.',
      startSession: 'Démarrer la session',
    },
    session: {
      title: 'Session',
      subtitle: 'Démarrer/arrêter votre session d’entraînement.',
      start: 'Démarrer',
      stop: 'Arrêter',
      endAndSummary: 'Terminer et voir le résumé',
    },
    summary: {
      title: 'Résumé',
      subtitle: 'Stub : le résumé de la session apparaîtra ici.',
      backToSetup: 'Retour à la configuration',
    },
    common: {
      missingKeys: 'Clés manquantes. Allez à la configuration.',
      locale: 'Langue',
    },
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
