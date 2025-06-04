"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClick = (page: number) => {
    onPageChange(page);
    scrollToTop();
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    const range = (start: number, end: number) => {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    if (totalPages <= 7) {
      return range(1, totalPages);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav
    dir="ltr"
      aria-label="Pagination"
      className="flex justify-center mt-6 space-x-1 select-none"
    >
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaChevronLeft />
      </button>

      {pageNumbers.map((number, index) =>
        typeof number === "number" ? (
          <button
            key={index}
            onClick={() => handleClick(number)}
            className={`px-3 py-1 rounded-md border border-blue-light transition
              ${
                number === currentPage
                  ? "bg-blue-light text-white border-blue-light"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
            aria-current={number === currentPage ? "page" : undefined}
          >
            {number}
          </button>
        ) : (
          <span
            key={index}
            className="px-2 py-1 text-gray-500 cursor-default select-none"
          >
            ...
          </span>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;
