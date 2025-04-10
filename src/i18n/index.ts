import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpBackend) // โหลดไฟล์ JSON สำหรับการแปล
    .use(LanguageDetector) // ตรวจจับภาษาของผู้ใช้
    .use(initReactI18next) // ใช้ร่วมกับ React
    .init({
        fallbackLng: "en", // ภาษาเริ่มต้น
        debug: true,
        interpolation: {
            escapeValue: false, // React จะจัดการการ escape เอง
        },
        backend: {
            loadPath: "/locales/{{lng}}/translation.json", // ที่อยู่ไฟล์แปล
        },
    });

export default i18n;