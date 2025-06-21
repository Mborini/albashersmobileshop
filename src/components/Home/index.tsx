"use client";
import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Hero from "./Hero";
import Categories from "./Categories";
import PromoBanner from "./PromoBanner";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import SliderImages from "./sliderImages";
import ProductHighlights from "./ProductHighlights";

const Home = () => {
  const categoriesRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const focus = searchParams.get("focus");

    if (focus === "categories" && categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });

      // Clean the URL without reloading
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <main>
      <SliderImages />
      <Hero />
      <div ref={categoriesRef}>
        <Categories />
      </div>
   <ProductHighlights />
      <CounDown />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
