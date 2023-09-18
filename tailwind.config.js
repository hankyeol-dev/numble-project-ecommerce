/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bottom-sheet-up": {
          "0%": { transform: "translateY(420px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
