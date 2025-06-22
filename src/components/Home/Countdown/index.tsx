"use client";
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchAdsImages } from "@/components/Admin/managment/images/services/adsServices";

const Video = () => {
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const video = adsImages.filter((img) => img.is_video === true);

  return (
    <section className="w-full pt-8 sm:pt-12 lg:pt-20 xl:pt-24 pb-5">
    <div className="w-full mx-auto px-4 sm:px-0"> {/* ✅ المسافة للموبايل فقط */}
      <div className="relative z-[1] flex flex-col items-center justify-center gap-10">
        {loading ? (
          <div className="w-full max-w-[900px]">
            <Skeleton height={400} borderRadius={16} />
          </div>
        ) : video.length > 0 ? (
          video.map((video) => (
            <video
              key={video.id}
              src={video.image_Url}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg w-full h-auto"
              aria-label="Video content"
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No videos available.</p>
        )}
      </div>
    </div>
  </section>
  
  );
};

export default Video;
