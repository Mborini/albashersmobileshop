"use client";

import { fetchAdsImages } from "@/components/Admin/managment/images/services/adsServices";
import Image from "next/image";
import { useEffect, useState } from "react";

const SliderImages = () => {
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadAdsImages();
  }, []);

  async function loadAdsImages() {
    setLoading(true);
    try {
      const data = await fetchAdsImages();
      setAdsImages(data.filter((img) => img.is_slider && img.is_main));
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (adsImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % adsImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [adsImages]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (adsImages.length === 0) return <div className="text-center py-10">No images found.</div>;

  return (
    <section className="w-full h-[100dvh] overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={adsImages[currentIndex]?.image_Url || "/fallback.jpg"}
          alt={`Slider Image ${currentIndex + 1}`}
          fill
          priority
          className="object-cover w-full h-full transition-opacity duration-1000 ease-in-out"
        />
      </div>
    </section>
  );
};

export default SliderImages;
