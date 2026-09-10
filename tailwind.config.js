import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1D4ED8",
          light: "#3B82F6",
          dark: "#1E3A8A",
        },
        secondary: "#F59E0B",
        accent: "#10B981",
      },
      listStyleType: {
        upperAlpha: "upper-alpha",
        lowerAlpha: "lower-alpha",
        lowerRoman: "lower-roman",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in-up": "slideInUp 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [typography],
};
