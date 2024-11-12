import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome",
          "logout": "Logout",
        },
      },
      fr: {
        translation: {
          "welcome": "Bienvenue",
          "logout": "Déconnexion",
        },
      },
    },
    lng: "fr", // langue par défaut
    fallbackLng: "en", // langue à utiliser si la langue sélectionnée n'est pas disponible
    interpolation: {
      escapeValue: false, // React déjà protège contre les XSS
    },
  });


export default i18n;
