"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const CounDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "December, 31, 2024";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    // @ts-ignore
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overflow-hidden py-20">
  <div className=" w-full mx-auto px-4 sm:px-8 xl:px-0">
    <div className="relative overflow-hidden z-[1] rounded-lg bg-[#E5EAF4] p-4 sm:p-7.5 lg:p-10 xl:p-15 flex flex-col items-center justify-center gap-10">
    
        <video
          src="/images/videos/vedio.mp4"
          autoPlay
          loop
          muted
          playsInline
          
          style={{ borderRadius: '16px', width: '75%', height: 'auto' }}
          aria-label="Video content"
        />
     
    </div>
  </div>
</section>

  );
};

export default CounDown;
