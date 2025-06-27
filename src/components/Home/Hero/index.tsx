import React, { useEffect, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { fetchAdsImages } from "@/components/Admin/managment/images/services/adsServices";
import { Center, Loader } from "@mantine/core";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Hero = () => {
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdsImages();
  }, []);

  async function loadAdsImages() {
    setLoading(true);
    try {
      const data = await fetchAdsImages();
      setAdsImages(data);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  }

  const sliderImages = adsImages.filter((img) => img.is_slider === true && img.is_main == false);
  const otherImages = adsImages.filter((img) => img.is_slider === false);

  if (loading) {
    return (
      <section className="pt-10 sm:pt-12 lg:pt-20 xl:pt-24 pb-5 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap gap-5">
            <div className="xl:max-w-[757px] w-full">
              <Skeleton height={400} borderRadius={10} />
            </div>
            <div className="xl:max-w-[393px] w-full">
              <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
                {[...Array(2)].map((_, idx) => (
                  <Skeleton key={idx} height={200} borderRadius={10} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <HeroFeature />
      </section>
    );
    
  }

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-10 sm:pt-12 lg:pt-20 xl:pt-24 bg-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-[#F5F5F7] overflow-hidden">
              
              <HeroCarousel images={sliderImages} />
            </div>
          </div>
  
          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col gap-5">
              {otherImages
                .filter((item) => item.is_video === false)
                .map((item) => (
                  <div
                    key={item.id}
                    className="w-full relative rounded-[10px] bg-[#F5F5F7] p-4 sm:p-7.5"
                  >
                    <div className="flex items-center gap-14">
                      <div>
                        <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                          {item.title}
                        </h2>
                        <div>
                          <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                            {item.description}
                          </p>
                          <span className="flex items-center gap-3">
                            <span className="font-medium text-xl text-dark">
                              JOD {item.discounted_Price}
                            </span>
                            <span className="font-medium text-lg text-dark-4 line-through">
                              JOD {item.price}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <Image
                          src={item.image_Url.trim()}
                          alt={item.title}
                          width={175}
                          height={175}
                          className="w-full max-w-[150px] h-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
  
      <HeroFeature />
    </section>
  );
  
};

export default Hero;
