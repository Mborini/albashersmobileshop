"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const HeroCarousel = ({ images }) => {
  if (!images?.length) return null;

  return (
    <Swiper
      spaceBetween={10}
      centeredSlides={true}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {images.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col sm:flex-row justify-between pr-4 sm:pr-8 h-auto sm:h-[411px]">
            {/* LEFT TEXT SIDE */}
            <div className="max-w-full sm:max-w-[394px] w-full py-5 sm:py-15 lg:py-24.5 px-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10 max-w-[50px]">
                <div className="flex items-center gap-2">
                  <span className="flex font-semibold text-heading-3 sm:text-heading-1 text-black">
                    {item.price && item.discounted_Price ? (
                      <>
                        -
                        {Math.round(
                          ((item.price - item.discounted_Price) / item.price) *
                            100
                        )}
                        %
                      </>
                    ) : (
                      <>0%</> // أو ما تعرض شيء نهائياً
                    )}
                  </span>

                  <span className="block text-black text-sm sm:text-custom-1 sm:leading-[24px]">
                    Sale
                    <br />
                    Off
                  </span>
                </div>
              </div>

              <h1 className="font-semibold text-black text-lg sm:text-3xl mb-3">
                {item.title}
              </h1>
              <p className="text-black text-sm sm:text-base line-clamp-3 overflow-hidden">
                {item.description}
              </p>
            </div>

            {/* RIGHT IMAGE SIDE */}
            <div className="flex justify-center sm:justify-end w-full h-[250px] sm:h-[358px]">
              <Image
                src={item.image_Url.trim()}
                alt={item.title}
                width={351}
                height={358}
                className="object-contain w-full h-full max-w-[300px] sm:max-w-full"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;
