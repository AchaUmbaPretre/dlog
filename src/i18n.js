// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passe le module i18next à react-i18next
  .init({
    resources: {
      en: {
        translation: {
          // Ajoute tes traductions en anglais ici
          "welcome": "Welcome",
          "logout": "Logout",
          // ... autres traductions
        },
      },
      fr: {
        translation: {
          // Ajoute tes traductions en français ici
          "welcome": "Bienvenue",
          "logout": "Déconnexion",
          // ... autres traductions
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
