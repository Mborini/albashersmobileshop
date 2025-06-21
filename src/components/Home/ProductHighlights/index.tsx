import React from "react";
import Link from "next/link";
import Image from "next/image";
import NewArrival from "../NewArrivals";
import BestSeller from "../BestOffers";

export default function ProductHighlights() {
    return (
      <>
        {/* Images for small screens only */}
        <div className="sm:hidden gap-2 mt-12 px-4 flex flex-col items-center">
          <Link
            href="/best-offers-products"
            className="relative block rounded-lg overflow-hidden cursor-pointer mb-4"
          >
            <Image
              src="/images/ProductHighlights/offer.png"
              alt="Best Seller"
              width={500}
              height={500}
              className="object-cover rounded-lg "
              priority
            />
          </Link>
  
          <Link
            href="/new-arrivals-products"
            className="relative block rounded-lg overflow-hidden cursor-pointer"
          >
            <Image
              src="/images/ProductHighlights/new.png"
              alt="New Arrival"
              width={500}
              height={215}
              className="object-cover h-[215px] rounded-lg "
              priority
            />
          </Link>
        </div>
  
        {/* Components for medium and up */}
        <div className="hidden sm:block">
          <NewArrival />
          <BestSeller />
        </div>
      </>
    );
  }
  