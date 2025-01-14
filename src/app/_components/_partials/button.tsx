import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export default function Button({
  className = '',
  variant = 'primary',
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    px-4
    py-2
    font-medium
    rounded-lg
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    shadow-xl
    focus:ring-offset-2
    ${className}
  `;

  const variants = {
    primary: `bg-main-color text-black hover:bg-main-color/80 focus:ring-main-color`,
    secondary: `bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500`,
    outline: `border border-main-color text-main-color hover:bg-main-color/10 focus:ring-main-color`,
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4 inline-block"></span>
      ) : (
        children
      )}
    </button>
  );
}
