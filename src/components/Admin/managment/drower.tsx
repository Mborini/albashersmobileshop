// components/Drawer.js
import React from 'react';

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`fixed top-0   right-0 h-full w-80 bg-white rounded-l-lg shadow-xl transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="p-5 flex justify-between items-center bg-meta-4 border-b border-gray-6">
        <h2 className="text-xl font-semibold text-red-dark">
  Edit Item
</h2>

          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="text-gray-500 hover:text-gray-900 transition-colors duration-200 text-3xl leading-none"
          >
            &times;
          </button>
        </header>

        <div className="p-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {children}
        </div>
      </aside>
    </>
  );
};

export default Drawer;
