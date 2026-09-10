import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      colors: {
        // Presbyterian violet scale (repurposed "navy" token so the existing
        // app-wide usage of navy-* re-themes automatically). 900/950 are the
        // deep liturgical violets used for headers, sidebars, and hero panels.
        navy: {
          50: "#faf0ff",
          100: "#f4dbff",
          200: "#eeb0ff",
          300: "#e08cf5",
          400: "#c77ede",
          500: "#a95fc4",
          600: "#804793",
          700: "#662f79",
          800: "#4a125e",
          900: "#2f0040",
          950: "#210030",
        },
        // Amber "gold" accent (secondary). Kept the gold token name.
        gold: {
          50: "#fffbeb",
          100: "#fff3c4",
          200: "#ffe088",
          300: "#fed65b",
          400: "#e9c349",
          500: "#d4a843",
          600: "#b8860b",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        warm: {
          white: "#fbf9f6",
          gray: "#efeeeb",
        },
        // Material-style surface tokens from the mockup, for finer control
        // where the semantic name reads clearer than a raw shade.
        surface: {
          DEFAULT: "#fbf9f6",
          low: "#f5f3f0",
          container: "#efeeeb",
          high: "#eae8e5",
          highest: "#e4e2df",
          lowest: "#ffffff",
        },
        ink: {
          DEFAULT: "#1b1c1a",
          variant: "#4d444e",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 20px rgba(212, 168, 67, 0.2)",
        "card-hover": "0 20px 40px rgba(47, 0, 64, 0.14)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
