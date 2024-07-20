/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["JosefinSans", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [
    // ...
    require("tailwind-scrollbar"),
  ],
};
