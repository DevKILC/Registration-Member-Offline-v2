import React from "react";
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]; // Data dropdown
  className?: string; // Kelas tambahan untuk styling kustom
  placeholder?: string; // Placeholder untuk dropdown
}

export default function Select({
  options,
  value,
  onChange,
  className = "",
  placeholder = "",
  ...props
}: SelectProps) {
  return (
    <select
      value={value} // Controlled component
      onChange={onChange}
      className={`
        w-full
        p-2
        h-10
        border
      border-black 
      border-opacity-40
        rounded-[10px]
        text-black
        focus:outline-none
      focus:ring-2
      focus:border-main-color
      focus:ring-main-color
      focus:ring-opacity-50
        ${className}
      `}
      {...props}
    >
      <option value="" disabled>
        {placeholder || "Pilih salah satu"}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

  );
}
