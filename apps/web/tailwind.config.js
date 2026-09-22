/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Paleta oficial de marca MercaGo
          orange: {
            DEFAULT: "#FF6B00",
            light: "#FF8A33",
            dark: "#E05E00",
            50: "#FFF5EB",
            100: "#FFE8D1",
            500: "#FF6B00",
            600: "#E05E00",
            700: "#B84D00",
          },
          emerald: {
            DEFAULT: "#00B47A",
            light: "#1AD598",
            dark: "#009162",
            50: "#E6FBF3",
            100: "#C2F7E1",
            500: "#00B47A",
            600: "#009162",
            700: "#00704C",
          },
          navy: {
            DEFAULT: "#0A2540",
            light: "#183B5E",
            dark: "#051626",
          },
          bg: "#F4F6F8",
          surface: "#F4F6F8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
