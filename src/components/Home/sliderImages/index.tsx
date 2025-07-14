"use client";

import { useEffect, useState } from "react";
import { fetchAdsImages } from "@/components/Admin/managment/images/services/adsServices";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const SliderImages = () => {
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 🟡 حالة التحميل - سكلتون
  if (loading) {
    return (
      <section className="w-full mt-14 aspect-[16/9] overflow-hidden">
        <Skeleton height="100%" width="100%" />
      </section>
    );
  }

  // 🔴 لا يوجد صور
  if (adsImages.length === 0) {
    return <div className="text-center py-10">No images found.</div>;
  }

  // ✅ الصور جاهزة للعرض
  return (
    <section className="w-full mt-14 aspect-[16/9] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {adsImages.map((img, idx) => (
          <SwiperSlide key={idx} className="w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src={img.image_Url || "/fallback.jpg"}
                alt={`Slider Image ${idx + 1}`}
                fill
                priority
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SliderImages;
