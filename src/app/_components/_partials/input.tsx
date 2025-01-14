import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string; // Kelas kustom
  icon?: React.ReactNode; // Opsional, ikon yang bisa ditampilkan di input
  wrapperClassName?: string; // Styling untuk wrapper
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type= '',
      className = '',
      wrapperClassName = '',
      icon,
      ...props
    },
    ref
  ) => {
    // Gaya dasar input
    const baseStyles = `
      w-full
      bg-transparent
      border
      border-gray-400
      rounded-[10px]
      px-3
      py-2
      focus:outline-none
      focus:ring-2
      focus:border-main-color
      focus:ring-main-color
      focus:ring-opacity-50
      text-black
    `;

    return (
      <div className={`relative ${wrapperClassName}`}>
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type={type}
          className={`${baseStyles} ${className} ${icon ? 'pl-10' : ''}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
