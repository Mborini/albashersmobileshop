"use client";
import { useEffect, useState } from "react";
import {IoChevronUpCircleSharp } from "react-icons/io5";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`items-center justify-center w-10 h-10  ease-out duration-200 fixed bottom-16 right-5 z-10 ${
            isVisible ? "flex" : "hidden"
          }`}
        >
<IoChevronUpCircleSharp color="black" size={48}/>
</button>
      )}
    </>
  );
}
