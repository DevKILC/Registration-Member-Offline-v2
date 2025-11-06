'use client';

import { X } from 'lucide-react';

interface PopupProps {
    title?: string;
    description?: string;
    description2?: string;
    isOpen: boolean;
    onClose: () => void;
    maxWidth?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    showButton?: boolean;
}

export default function Popup({
    title,
    description,
    description2,
    isOpen,
    onClose,
    maxWidth = "95vw",
    buttonText = "OK",
    onButtonClick,
    showButton = true
}: PopupProps) {

    if (!isOpen) return null;

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto flex flex-col"
                style={{ 
                    maxWidth: maxWidth,
                    minHeight: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                    aria-label="Close popup"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                {/* Text Content Section */}
                {(title || description || showButton) && (
                    <div className="flex-shrink-0 p-6 sm:p-8 bg-white rounded-lg">
                        {/* Title */}
                        {title && (
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 pr-8 leading-tight text-center">
                                {title}
                            </h2>
                        )}

                        {/* Description */}
                        {description && (
                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 text-center max-w-2xl mx-auto">
                                <p>{description}</p>
                            </div>
                        )}

                        {description2 && (
                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 text-center max-w-2xl mx-auto italic">
                                <p>{description2}</p>
                            </div>
                        )}

                        {/* Action Button */}
                        {showButton && (
                            <div className="mt-4 pt-3 border-t border-gray-200 w-full mx-auto">
                                <button
                                    onClick={handleButtonClick}
                                    className="w-full bg-main-color hover:bg-main-color-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                                >
                                    {buttonText}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}