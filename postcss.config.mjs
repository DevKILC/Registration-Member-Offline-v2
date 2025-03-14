/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {}, // This allows using @import in CSS files
    'tailwindcss': {},     // Tailwind CSS plugin
    'autoprefixer': {},    // Automatically adds vendor prefixes
    'postcss-simple-vars': {}, // Allows using variables like process.env in your CSS
  },
};

export default config;
