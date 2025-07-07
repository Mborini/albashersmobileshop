"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-10 sm:py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="rounded-lg bg-[#F5F5F7] px-4 sm:px-7 lg:px-14 xl:px-20 py-5 sm:py-5 lg:py-2 xl:py-2 flex items-center justify-between flex-row-reverse gap-6 sm:gap-10 mb-8">
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: false, amount: 0.3 }}
    className="w-[180px] sm:w-[220px] lg:w-[274px] shrink-0"
  >
    <Image
      src="/images/promo/airpodsmax.png"
      alt="AirPods Max image"
      width={300}
      height={300}
      style={{ width: "100%", height: "auto", padding: "20px" }}
      priority
    />
  </motion.div>

  <div className="max-w-full sm:max-w-[550px] w-full">
    <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-dark mb-4 sm:mb-5">
      AirPods Max
    </h2>
    <p className="text-sm sm:text-base leading-relaxed">
      Fully immersing you in every sound.
    </p>
  </div>
</div>


        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
  {/* ✅ بطاقة AirPods */}
  <div className="rounded-lg bg-[#F5F5F7] px-4 sm:px-7 lg:px-14 xl:px-20 py-5 sm:py-5 lg:py-2 xl:py-2 flex items-center justify-between flex-row-reverse gap-6 sm:gap-10 mb-8">
  {/* صورة AirPods */}
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
      className="w-[120px] sm:w-[160px] xl:w-[200px] shrink-0"
    >
      <Image
        src="/images/promo/airpods.png"
        alt="AirPods image"
        width={200}
        height={200}
        style={{ width: "100%", height: "auto" }}
        priority
      />
    </motion.div>

    {/* النص */}
    <div>
      <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-dark mb-2">
        AirPods
      </h2>
      <p className="max-w-[100%] sm:max-w-[285px] text-sm sm:text-base">
        Personalized Spatial Audio that immerses you in sound
      </p>
    </div>
  </div>

  {/* ✅ بطاقة AirTag */}
  <div className="rounded-lg bg-[#F5F5F7] px-4 sm:px-7 lg:px-14 xl:px-20 py-5 sm:py-5 lg:py-2 xl:py-2 flex items-center justify-between flex-row-reverse gap-6 sm:gap-10 mb-8">
  {/* صورة AirTag */}
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
      className="w-[120px] sm:w-[160px] xl:w-[200px] shrink-0"
    >
      <Image
        src="/images/promo/airtag.png"
        alt="AirTag image"
        width={200}
        height={200}
        style={{ width: "100%", height: "auto" }}
        priority
      />
    </motion.div>

    {/* النص */}
    <div>
      <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-dark mb-2">
        AirTag
      </h2>
      <p className="max-w-[100%] sm:max-w-[285px] text-sm sm:text-base">
        Lose your knack for losing things.
      </p>
    </div>
  </div>
</div>

      </div>
    </section>
  );
};

export default PromoBanner;
