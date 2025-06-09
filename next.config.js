// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
      locales: ['en', 'ar'],        
      defaultLocale: 'en',         
      localeDetection: false        
    },
    images: {
    domains: ['res.cloudinary.com'],
  }
  };
  
  module.exports = nextConfig;
  