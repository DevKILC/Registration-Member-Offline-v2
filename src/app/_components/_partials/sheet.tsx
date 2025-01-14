"use client";

import React, { useState, useEffect, useRef } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  initialHeight?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title = "Bottom Sheet",
  initialHeight = "50%",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [height, setHeight] = useState(initialHeight);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    let mountTimeout: NodeJS.Timeout;
    let animationTimeout: NodeJS.Timeout;

    if (isOpen) {
      setIsVisible(true);
      mountTimeout = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      animationTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 400);
    }

    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(animationTimeout);
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    startHeight.current = parseInt(height, 10);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startY.current === 0) return;

    const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const diff = currentY - startY.current;

    // Adjust height dynamically
    const newHeight = Math.max(20, Math.min(100, startHeight.current - diff / window.innerHeight * 100));
    setHeight(`${newHeight}%`);
  };

  const handleDragEnd = () => {
    startY.current = 0;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 h-screen flex items-end justify-center transition-all duration-300 ease-in-out ${
        isAnimating ? "bg-black/50" : "bg-black/0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full bg-white rounded-t-2xl shadow-xl will-change-transform z-[999] ${
          isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{
          height,
          transition: `
            transform 0.4s cubic-bezier(0.33, 1, 0.68, 1),
            opacity 0.3s cubic-bezier(0.33, 1, 0.68, 1)
          `,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div
          className="w-full flex justify-center pt-2 pb-4 cursor-pointer"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-10 h-1 rounded-full bg-gray-300"></div>
        </div>

        {/* Header */}
        <div className="px-6 pb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          className="px-6 pb-6 overflow-y-auto"
          style={{
            height: "calc(100% - 100px)",
            overscrollBehavior: "contain",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
