import React from 'react';

interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
}

export default function Label({ htmlFor, children, className = '', required = false }: LabelProps){
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm text-gray-700 ${className}`}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};
