"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { Toaster } from "react-hot-toast";
import MobileBottomNav from "@/components/Header/MobileBottomNav";
import ChatPopup from "@/components/Header/ChatPopup";
import { Analytics } from "@vercel/analytics/react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html suppressHydrationWarning={true} lang="ar">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P16MQLCZYG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P16MQLCZYG', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Analytics /> {/* Vercel Analytics */}
                    <Header />
                    <ChatPopup />
                    {children}
                    <MobileBottomNav />
                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: "Euclid Circular A",
                  zIndex: 99999,
                },
              }}
            />

            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
