import ChatPopup from "@/components/Header/ChatPopup";
import Home from "@/components/Home";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Al-Basher Shop",
  description:
    "أفضل متجر في إربد لبيع أجهزة iPhone الأصلية، اكسسوارات الهواتف، ساعات آبل، شواحن أصلية، وصلات شحن، ملحقات آيباد، منتجات جيروم، أنكر، جوجل وغيرها من أفضل العلامات التجارية. تسوق الآن مع توصيل سريع وخدمة مميزة في الأردن.",
  keywords: [
    // أسماء المتجر
    "البشير شوب",
    "Albasher Shop - البشير شوب",
    "Al-Basher Shop",
    "albashershop",
    "albasher",

    // أجهزة آبل والهواتف
    "Apple",
    "ايفون",
    "آيفون إربد",
    "بيع آيفون الأردن",
    "iPhone Irbid",
    "iPhone accessories Jordan",
    "Apple watches Irbid",
    "أجهزة آيباد الأردن",
    "iPad accessories Jordan",
    "Apple accessories Jordan",

    // اكسسوارات عامة
    "اكسسوارات آيفون",
    "شواحن iPhone",
    "وصلات شحن",
    "شواحن سريعة آيفون",
    "كابلات شحن أصلية",
    "جرابات آيفون أصلية",
    "اكسسوارات هواتف ذكية",
    "ملحقات الهواتف المحمولة",
    "سماعات بلوتوث إربد",

    // علامات تجارية مشهورة
    "Jerome accessories",
    "Anker chargers",
    "Anker cables",
    "Google accessories",
    "Google Pixel accessories",
    "جيروم اكسسوارات",
    "أنكر شواحن",
    "أنكر وصلات شحن",
    "جوجل اكسسوارات",

    // أجهزة أخرى
    "Smartphone accessories Irbid",
    "Original Apple chargers",
    "Wireless chargers",
    "Power banks Anker",
    "iPhone cases Irbid",
    "Apple certified accessories",
    "Apple genuine products",
    "iPhone screen protectors",
    "iPhone tempered glass",
  ],
  openGraph: {
    title: "متجر الآيفون في إربد | Al-Basher Shop",
    description:
      "تسوق أفضل أجهزة iPhone واكسسواراتها الأصلية في إربد الأردن مع منتجات أصلية من Apple، Jerome، Anker، Google وغيرها من العلامات التجارية الرائدة. ساعات آبل، شواحن، وصلات شحن، وملحقات آيباد بجودة عالية وأسعار منافسة.",
    url: "https://www.albashershop.com",
    siteName: "Al-Basher Shop",
    images: [
      {
        url: "https://www.albashershop.com/og-iphone-erbed.jpg",
        width: 1200,
        height: 630,
        alt: "متجر الآيفون في إربد - Al-Basher Shop",
      },
    ],
    locale: "ar_JO",
    type: "website",
  },
  
  metadataBase: new URL("https://www.albashershop.com"),
};

export default function HomePage() {
  return (
    <>
      <Home />
     

      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Al-Basher Shop",
            telephone: "+9627 9685 5578", 
            address: {
              "@type": "PostalAddress",
              addressLocality: "Irbid",
              addressCountry: "JO",
            },
            sameAs: [
              "https://www.facebook.com/AlbasherShop", 
              "https://www.instagram.com/albasher.jo",  
            ],
            url: "https://www.albashershop.com",
          }),
        }}
      />
    </>
  );
}
