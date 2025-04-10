import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "@/locales/en/translation.json";
import thTranslation from "@/locales/th/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslation },
      th: { translation: thTranslation },
    },
  });

export default i18n;