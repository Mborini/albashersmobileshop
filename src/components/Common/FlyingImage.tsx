"use client";
import React, { useEffect, useRef } from "react";

type FlyingImageProps = {
  imageSrc: string;
  startRect: DOMRect;
  onComplete: () => void;
};

const FlyingImage = ({ imageSrc, startRect, onComplete }: FlyingImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    el.style.position = "fixed";
    el.style.left = `${startRect.left}px`;
    el.style.top = `${startRect.top}px`;
    el.style.width = `${startRect.width}px`;
    el.style.height = `${startRect.height}px`;
    el.style.transition = "transform 1.5s ease, opacity 1.5s ease";
    el.style.zIndex = "9999";
    el.style.borderRadius = "8px";
    el.style.opacity = "1";

    const isSmallScreen = window.innerWidth < 1024;

    if (isSmallScreen) {
      // الحركة للأسفل في أقصى اليمين
      const targetX = window.innerWidth - startRect.left - startRect.width - 100; // أقصى اليمين
      const targetY = window.innerHeight - startRect.top - startRect.height ; // نزول للأسفل مع إضافة 50px للزيحة

      requestAnimationFrame(() => {
        el.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.5)`;
        el.style.opacity = "0.3";
      });
    } else {
      // الحركة باتجاه اليمين العلوي مع الزيحة على شاشات أكبر
      const offsetX = 130;
      const offsetY = 20;

      const targetX = window.innerWidth - startRect.left - startRect.width - offsetX;
      const targetY = -startRect.top + offsetY;

      requestAnimationFrame(() => {
        el.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.5)`;
        el.style.opacity = "0.3";
      });
    }

    const handleTransitionEnd = () => {
      onComplete();
    };

    el.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      el.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [startRect, onComplete]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt="flying"
      className="pointer-events-none shadow-lg"
    />
  );
};

export default FlyingImage;
