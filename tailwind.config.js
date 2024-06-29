/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // default prefix is "ui"
    require("@kobalte/tailwindcss"),
  ],
};
