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
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {images.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row justify-between pr-4 sm:pr-8 h-[450px]">
            {/* LEFT TEXT SIDE */}
            <div className="max-w-full sm:max-w-[394px] w-full py-10 sm:py-15 lg:py-24.5 px-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10 max-w-[50px]">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  {item.discount_percentage ?? "30"}%
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <a href="#">{item.title}</a>
              </h1>

              <p className="text-dark text-sm sm:text-base line-clamp-3 overflow-hidden">
                {item.description}
              </p>
            </div>

            {/* RIGHT IMAGE SIDE */}
            <div className="flex justify-center sm:justify-end w-full sm:w-[350px] h-[358px]">
              <Image
                src={item.image_Url.trim()}
                alt={item.title}
                width={351}
                height={358}
                className="object-contain h-full w-full"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;
