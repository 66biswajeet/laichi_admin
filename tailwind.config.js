const defaultTheme = require("tailwindcss/defaultTheme");

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brown: {
          50: "#fdf8f6",
          100: "#f8ede8",
          200: "#f0d9cd",
          300: "#e4bea8",
          400: "#d49b7b",
          500: "#c87e58",
          600: "#b8683f",
          700: "#9a5533",
          800: "#7d462d",
          900: "#663b28",
          950: "#371d13",
        },
        coffee: {
          50: "#faf8f5",
          100: "#f3ede4",
          200: "#e5d8c5",
          300: "#d4bca0",
          400: "#c09a75",
          500: "#b0825a",
          600: "#a2704e",
          700: "#875a42",
          800: "#6e4a39",
          900: "#5a3e31",
          950: "#302018",
        },
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        serif: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
        "brown-lg":
          "0 10px 15px -3px rgba(146, 64, 14, 0.1), 0 4px 6px -2px rgba(146, 64, 14, 0.05)",
        "brown-xl":
          "0 20px 25px -5px rgba(146, 64, 14, 0.1), 0 10px 10px -5px rgba(146, 64, 14, 0.04)",
      },
      height: {
        28: "100px",
        sm: "350px",
        md: "400px",
        330: "330px",
        440: "440px",
        lg: "500px",
        xl: "600px",
      },
      width: {
        80: "80px",
        100: "100px",
        200: "200px",
        300: "300px",
        400: "400px",
      },
      padding: {
        2.5: "10px",
      },
      screens: {
        "2xl": "1440px",
        xl: "1280px",
        lg: "1024px",
        ipad: { min: "960px", max: "1023px" },
        md: "768px",
        sm: "640px",
        xs: "420px",
        xss: "320px",
      },
      inset: {
        "-1": "-1rem",
        "-2": "-2rem",
        "-3": "-3rem",
        "-4": "-4rem",
        "-5": "-5rem",
        "-6": "-6rem",
        "-7": "-7rem",
        "-8": "-8rem",
        "-9": "-9rem",
        "-10": "-10rem",
        1: "1rem",
        2: "2rem",
        3: "3rem",
        4: "4rem",
        5: "5rem",
        6: "6rem",
        7: "7rem",
        8: "8rem",
        9: "9rem",
        10: "10rem",
      },
    },
  },
  variants: {
    display: ["group-hover"],
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    //require('tailwind-scrollbar')
  ],
};

module.exports = {
  ...config,
};
