import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],

    detection: {
      // لا تعتمد على لغة الجهاز كخيار أول
      order: ["localStorage"],

      // المكان الذي سيتم حفظ اختيار المستخدم فيه
      caches: ["localStorage"],

      lookupLocalStorage: "i18nextLng",
    },

    debug: false,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;