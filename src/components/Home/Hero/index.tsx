import React, { useEffect, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { fetchAdsImages } from "@/components/Admin/managment/images/services/adsServices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

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

  const sliderImages = adsImages.filter(
    (img) => img.is_slider === true && img.is_main == false
  );
  const otherImages = adsImages.filter(
    (img) => img.is_slider === false && img.is_video === false
  );

  if (loading) {
    return (
      <section className="pt-10 sm:pt-12 lg:pt-20 xl:pt-24 pb-5 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`col-span-${i === 0 || i === 4 ? 2 : 1}`}>
                <Skeleton height={400} borderRadius={10} />
              </div>
            ))}
          </div>
        </div>
        <HeroFeature />
      </section>
    );
  }

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-10 sm:pt-12 lg:pt-20 xl:pt-24 bg-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* السطر الأول */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ amount: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-[10px] bg-[#F5F5F7] overflow-hidden h-full">
              <HeroCarousel images={sliderImages} />
            </div>
          </motion.div>

          {otherImages[0] && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ amount: 0.2 }}
              className=""
            >
              <Card item={otherImages[0]} />
            </motion.div>
          )}

          {/* السطر الثاني */}
          {otherImages[1] && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ amount: 0.2 }}
              className=""
            >
              <Card item={otherImages[1]} />
            </motion.div>
          )}

          {otherImages[2] && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ amount: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center pt-6 sm:pt-0 flex-col sm:flex-row justify-between pr-4 sm:pr-8 h-auto sm:h-[411px] bg-[#F5F5F7] rounded-[10px] overflow-hidden">
                {/* LEFT TEXT */}
                <div className="max-w-full sm:max-w-[394px] w-full py-5 px-4 sm:pl-7.5 lg:pl-12.5">
                  <div className="flex items-center gap-4 mb-7.5 max-w-[50px]">
                    <div className="flex items-center gap-2">
                      <span className="flex font-semibold text-heading-3 sm:text-heading-1 text-black">
                        -
                        {Math.round(
                          ((otherImages[2].price - otherImages[2].discounted_Price) /
                            otherImages[2].price) *
                            100
                        )}
                        %
                      </span>
                      <span className="block text-dark text-sm sm:text-custom-1 leading-[24px]">
                        Sale
                        <br />
                        Off
                      </span>
                    </div>
                  </div>

                  <h1 className="font-semibold text-black text-lg sm:text-3xl mb-3">
                    {otherImages[2].title}
                  </h1>
                  <p className="text-black text-sm sm:text-base line-clamp-3">
                    {otherImages[2].description}
                  </p>

                  <div className="flex items-center gap-4 mt-5">
  <span className="font-medium text-xl text-black">
    JD {otherImages[2].discounted_Price}
  </span>
  {otherImages[2].discounted_Price !== otherImages[2].price && (
    <span className="font-medium text-lg text-dark-4 line-through">
      JD {otherImages[2].price}
    </span>
  )}
</div>

                </div>

                {/* IMAGE */}
                <div className="flex justify-center sm:justify-end w-full h-[250px] sm:h-[358px]">
                  <Image
                    src={otherImages[2].image_Url.trim()}
                    alt={otherImages[2].title}
                    width={351}
                    height={358}
                    className="object-contain w-full h-full max-w-[300px] sm:max-w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* باقي العناصر */}
          {otherImages.slice(3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ amount: 0.2 }}
              className=""
            >
              <Card item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({ item }) => (
  <div className="w-full rounded-[10px] bg-[#F5F5F7] p-4 sm:p-7.5 h-full flex flex-col items-center text-center gap-4">
    <h2 className="font-semibold text-black text-xl">{item.title}</h2>
    <p className="font-medium text-dark-4 text-custom-sm">{item.description}</p>
    <div className="max-w-[220px] max-h-[200px] w-full">
      <Image
        src={item.image_Url.trim()}
        alt={item.title}
        width={220}
        height={200}
        className="w-full h-auto object-contain"
      />
    </div>
   <span className="flex items-center gap-3 justify-center">
  <span className="font-medium text-xl text-black">
    JD {item.discounted_Price}
  </span>
  {item.discounted_Price !== item.price && (
    <span className="font-medium text-lg text-dark-4 line-through">
      JD {item.price}
    </span>
  )}
</span>

  </div>
);

export default Hero;
