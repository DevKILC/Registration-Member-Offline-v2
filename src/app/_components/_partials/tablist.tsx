import React from 'react';

interface TabListProps {
    label: string;
    value: string | number;
    isActive?: boolean;
    onClick?: (value: string | number) => void;
    className?: string;
}

export default function TabList({
    label,
    value,
    isActive = false,
    onClick,
    className = "",
}: TabListProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(value);
        }
    };

    return (
        <li
            onClick={handleClick}
            className={`
            border
            py-2
            px-3
            cursor-pointer
            rounded-[10px]
            text-sm
            text-center
            hover:text-black
            hover:bg-main-color
            focus:outline-none
            focus:ring-2
            focus:ring-opacity-50
            transition-transform
            duration-300
            ${className}
            ${isActive
                    ? ' bg-main-color text-black hover:bg-main-color border border-gray-400'
                    : 'border-black/40 text-gray-400'
                }
            `}
        >
            {label}
        </li>
    );
};

