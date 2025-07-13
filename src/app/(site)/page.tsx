import ChatPopup from "@/components/Header/ChatPopup";
import Home from "@/components/Home";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "متجر البشير شوب | أجهزة iPhone واكسسوارات أصلية في إربد - Al-Basher Shop",
  description:
    "متجر متخصص في بيع أجهزة iPhone الأصلية واكسسواراتها في إربد. شواحن، ساعات، كابلات، وملحقات من Apple، Anker، Google، والمزيد. توصيل سريع وخدمة احترافية.",
  keywords: [
    "البشير شوب",
    "Al-Basher Shop",
    "Albasher Shop",
    "Al-Basher iPhone Store",
    "متجر البشير",
    "متجر آيفون إربد",
    "متجر آبل إربد",
    "متجر آيفون الأردن",
    "محلات البشير",
    "محلات البشير شوب",
    "iPhone إربد",
    "ايفون الأردن",
    "متجر آيفون إربد",
    "Irbid iPhone store",
    "iPhone Jordan",
    "best iPhone shop Irbid",
    "Apple Irbid",
    "buy iPhone Irbid",
    "buy Apple products Jordan",
    "ايفون أصلي",
    "اكسسوارات آيفون",
    "ساعات آبل",
    "شواحن أصلية",
    "وصلات شحن آيفون",
    "جرابات آيفون",
    "كابلات شحن أصلية",
    "ملحقات آيباد",
    "توصيل سريع إربد",
    "سماعات بلوتوث",
    "بطاريات متنقلة",
    "حماية شاشة آيفون",
    "كفرات آيفون أصلية",
    "سماعات AirPods",
    "قلم آبل",
    "ملحقات أبل الأصلية",
    "original iPhone",
    "iPhone accessories",
    "Apple Watch Jordan",
    "fast iPhone chargers",
    "original charging cables",
    "iPad accessories Jordan",
    "bluetooth headphones",
    "power banks Irbid",
    "wireless chargers",
    "screen protectors",
    "Apple certified accessories",
    "genuine Apple products",
    "AirPods Jordan",
    "Apple Pencil",
    "Apple cases and covers",
    "Apple MagSafe accessories",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 11",
    "iPhone SE",
    "iPhone XR",
    "iPhone XS",
    "iPhone X",
    "iPhone 8 Plus",
    "iPhone 8",
    "iPad Pro",
    "iPad Air",
    "iPad Mini",
    "iPad 10th Gen",
    "Apple Watch Ultra",
    "Apple Watch Series 9",
    "Apple Watch SE",
    "MacBook Pro",
    "MacBook Air",
    "AirPods Pro",
    "AirPods 3rd Gen",
    "AirPods Max",
    "Apple TV 4K",
    "Apple Pencil 2nd Gen",
    "Anker Jordan",
    "Anker accessories",
    "Jerome accessories",
    "جيروم اكسسوارات",
    "Google Pixel accessories",
    "Google chargers",
    "أنكر شواحن",
    "أنكر كابلات",
    "اكسسوارات Google",
    "smartphone accessories Irbid",
    "mobile accessories Jordan",
    "tech store Irbid",
    "online shop Irbid",
    "best electronics shop Jordan",
    "متجر الكتروني في إربد",
    "أفضل متجر تقني في إربد",
    "متجر آبل إربد",
    "متجر أبل الأردن",
  ],

  openGraph: {
    title: "متجر الآيفون في إربد | Al-Basher Shop",
    description:
      "تسوق أفضل أجهزة iPhone واكسسواراتها الأصلية في إربد الأردن مع منتجات أصلية من Apple، Jerome، Anker، Google وغيرها من العلامات التجارية الرائدة.",
    url: "https://www.albashershop.com",
    siteName: "Al-Basher Shop",
    images: [
      {
        url: "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/cover%5B1%5D.png",
        width: 1200,
        height: 630,
        alt: "متجر الآيفون في إربد - Al-Basher Shop",
      },
    ],
    locale: "ar_JO",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    site: "@AlbasherShop",
    title: "متجر البشير شوب | iPhone واكسسوارات أصلية في إربد",
    description:
      "أفضل متجر في إربد لأجهزة iPhone واكسسواراتها الأصلية. منتجات Apple، Anker، Google، والمزيد.",
    images: [
      "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/cover%5B1%5D.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  metadataBase: new URL("https://www.albashershop.com"),
};

export default function HomePage() {
  return (
    <>
      <Home />
      <ChatPopup />

      {/* ✅ Structured Data - المتجر */}
      <Script
        id="store-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Al-Basher Shop",
            telephone: "+962796855578",
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

      {/* ✅ Structured Data - منتج (مثال: iPhone 15 Pro) */}
      <Script
        id="product-iphone15"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: "iPhone 15 Pro",
            image: [
              "https://www.albashershop.com/images/products/iphone15pro.jpg",
            ],
            description:
              "أحدث إصدار من آيفون مع شاشة Super Retina XDR وكاميرات متطورة.",
            brand: {
              "@type": "Brand",
              name: "Apple",
            },
            offers: {
              "@type": "Offer",
              url: "https://www.albashershop.com/products/iphone-15-pro",
              priceCurrency: "JOD",
              price: "1050",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: "Al-Basher Shop",
              },
            },
          }),
        }}
      />

      {/* ✅ Structured Data - النشاط المحلي */}
      <Script
        id="local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Al-Basher Shop",
            image:
              "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/cover%5B1%5D.png",
            "@id": "https://www.albashershop.com",
            url: "https://www.albashershop.com",
            telephone: "+962796855578",
            address: {
              "@type": "PostalAddress",
              streetAddress: "اربد دوار القبة",
              addressLocality: "Irbid",
              addressRegion: "إربد",
              postalCode: "21110",
              addressCountry: "JO",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 32.5556,
              longitude: 35.85,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Saturday",
                ],
                opens: "10:00",
                closes: "22:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Friday",
                opens: "16:00",
                closes: "22:00",
              },
            ],
            sameAs: [
              "https://www.facebook.com/AlbasherShop",
              "https://www.instagram.com/albasher.jo",
            ],
          }),
        }}
      />

      {/* ✅ Structured Data - Breadcrumbs */}
      <Script
        id="breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "الرئيسية",
                item: "https://www.albashershop.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "وصل حديثا",
                item: "https://www.albashershop.com/new-arrivals-products",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "افضل العروض",
                item: "https://www.albashershop.com/best-offers-products",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "apple",
                item: "https://www.albashershop.com/products/ProductsBrands/27",
              },
            ],
          }),
        }}
      />
    </>
  );
}
