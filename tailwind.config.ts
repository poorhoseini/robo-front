import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        dana: ["dana", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        metropolis: ["Metropolis"],
      },
      height: {
        "dynamic-full": "100dvh",
      },
      colors: {
        // neutral: {
        //   50: "#F9FAFB",
        //   100: "#F2F6F7",
        //   200: "#E3E4EB",
        //   300: "#DBE5E8", //border
        //   400: "#C1C4D2",
        //   500: "#8E93AD",
        //   900: "#111217",
        // },
        neutral: "#F8F9FB",
        primary: "#535353",
        secondary: "#FBEFD2",
        error: {
          DEFAULT: "#f44336",
          light: "#e57373",
          dark: "#d32f2f",
        },
        grey: {
          DEFAULT: "#404040",
          100: "#ECECEC",
          200: "#D9D9D9",
          300: "#C6C6C6",
          400: "#B3B3B3",
          500: "#9F9F9F",
          600: "#8C8C8C",
          700: "#797979",
          800: "#666666",
          900: "#535353",
        },
        blue: {
          DEFAULT: "#2897FF",
          100: "#3EA1FF",
          200: "#53ACFF",
          300: "#69B6FF",
          400: "#7EC1FF",
          500: "#93CBFF",
          600: "#A9D5FF",
          700: "#BEE0FF",
          800: "#D4EAFF",
          900: "#E9F5FF",
        },
        biege: {
          DEFAULT: "#FBEFD2",
          100: "#FBF1D7",
          200: "#FCF2DB",
          300: "#FCF4DF",
          400: "#FDF5E4",
          500: "#FDF7E9",
          600: "#FDF9ED",
          700: "#FEFAF1",
          800: "#FEFCF6",
          900: "#FFFDFB",
        },
        brown: "#6B5A2F",
        orange: "#FF9F51",
        // secondary: {
        //   500: "#FFB21C",
        // },
        // error: {
        //   500: "#EF4444",
        // },
        // main: "#00495E",
        // black: "#1D2729",
        // grey: "#AABABF",
        red: {
          DEFAULT: "#EE384E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
