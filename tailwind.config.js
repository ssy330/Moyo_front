/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a", // ✅ Tailwind green-600
          foreground: "#ffffff", // 글자색 (흰색)
        },
      },
    },
  },
  plugins: [require("tw-animate-css")],
};
