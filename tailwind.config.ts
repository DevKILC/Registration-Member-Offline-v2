import { Config } from "tailwindcss";

// Use CSS variables
const mainColorVar = "var(--main-color)"; // This is your dynamic main color

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'main-color': mainColorVar,  // Use the main color CSS variable
        'main-color-50': 'var(--main-color-50)',
        'main-color-200': 'var(--main-color-200)',
        'main-color-500': 'var(--main-color-500)',
        'main-color-700': 'var(--main-color-700)',
        'bill': 'var(--bill)',
        'color': 'var(--text-color)',
      },
    },
  },
  plugins: [],
} satisfies Config;
