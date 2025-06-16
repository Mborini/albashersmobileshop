"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchAdsImages } from "@/components/Admin/managment/images/services/adsServices";

const CounDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const deadline = "December, 31, 2024";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  const loadAdsImages = async () => {
    setLoading(true);
    try {
      const data = await fetchAdsImages();
      setAdsImages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
     loadAdsImages();
    // @ts-ignore
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);
  const video= adsImages.filter((img) => img.is_video === true);

  return (
    <section className="overflow-hidden py-20">
  <div className=" w-full mx-auto px-4 sm:px-8 xl:px-0">
    <div className="relative overflow-hidden z-[1] rounded-lg bg-[#E5EAF4] p-2 sm:p-7.5 lg:p-10 xl:p-15 flex flex-col items-center justify-center gap-10">
    
    {video.map((video) => (
  <video
    key={video.id} // ✅ مهم جداً
    src={video.image_Url}
    autoPlay
    loop
    muted
    playsInline
    style={{ borderRadius: '16px', width: '100%', height: 'auto' }}
    aria-label="Video content"
  />
))}

    </div>
  </div>
</section>

  );
};

export default CounDown;
