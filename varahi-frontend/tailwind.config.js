/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
 "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
      },
    },
  },
  plugins: [
     require("tailwind-scrollbar-hide"), 
  ],
}

