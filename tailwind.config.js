/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"]
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "sunset"]
  }
};
