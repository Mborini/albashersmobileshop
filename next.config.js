// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
      locales: ['en', 'ar'],       // اللغات التي يدعمها الموقع
      defaultLocale: 'en',         // اللغة الافتراضية
      localeDetection: false        // لتفعيل كشف لغة المتصفح تلقائيًا
    },
  };
  
  module.exports = nextConfig;
  