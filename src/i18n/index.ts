import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../../public/locales/en/translation.json";
import thTranslation from "../../public/locales/th/translation.json";

if (!i18n.isInitialized) {
  if (typeof window !== "undefined") {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    fallbackLng: "en",
    lng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslation },
      th: { translation: thTranslation },
    },
  });
}

export default i18n;
