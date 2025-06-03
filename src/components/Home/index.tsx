'use client';
import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestOffers";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";

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
      <Hero />
      <div ref={categoriesRef}>
        <Categories />
      </div>
      <NewArrival />
      <BestSeller />
      <CounDown />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
