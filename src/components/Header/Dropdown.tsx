"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const Dropdown = ({ menuItem, stickyMenu }) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = usePathname();
  const isActive = pathUrl.includes(menuItem.title);

  const dropdownBgColor = stickyMenu ? "bg-white" : "bg-blue-600";
  const dropdownItemText = "text-black";

  return (
    <li
      onClick={() => setDropdownToggler((prev) => !prev)}
      className="relative cursor-pointer"
    >
      {/* Main button */}
      <div
        className={`flex items-center justify-between gap-2 text-custom-sm font-medium capitalize ${
          stickyMenu ? "xl:py-4 text-black" : "xl:py-6 text-black"
        } ${isActive ? "text-blue-600" : ""}`}
      >
        {menuItem.title}
        <svg
          className={`w-4 h-4 transform transition-transform duration-300 ${
            dropdownToggler ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {dropdownToggler && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg z-50 ${dropdownBgColor}`}
          >
            {menuItem.submenu.map((item, i) => {
              const isCurrent = pathUrl === item.path;
              return (
                <Link key={i} href={item.path} >
                <a
                  className={`group relative px-4 py-2 text-sm font-semibold inline-block overflow-hidden ${
                    isCurrent ? "text-blue-600" : "text-black"
                  }`}
                >
                  {item.title}
                  <span
                    className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"
                  />
                </a>
              </Link>
              
              
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Dropdown;
