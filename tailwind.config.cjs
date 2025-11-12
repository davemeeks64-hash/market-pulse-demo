/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: "rgba(0, 255, 0, 0.7)",
        neonYellow: "rgba(255, 215, 0, 0.6)",
        neonRed: "rgba(255, 0, 0, 0.6)",
        neonBlue: "rgba(100, 100, 255, 0.6)",
      },
      boxShadow: {
        hot: "0 0 25px 4px rgba(0,255,0,0.8)",
        watch: "0 0 25px 4px rgba(255,215,0,0.6)",
        steady: "0 0 25px 4px rgba(255,0,0,0.6)",
        chill: "0 0 25px 4px rgba(100,100,255,0.4)",
      },
    },
  },
  safelist: [
    "shadow-[0_0_20px_2px_rgba(255,0,0,0.6)]",
    "shadow-[0_0_20px_2px_rgba(255,215,0,0.4)]",
    "shadow-[0_0_20px_2px_rgba(0,255,0,0.3)]",
    "shadow-[0_0_20px_2px_rgba(0,255,255,0.3)]",
    "shadow-[0_0_25px_4px_rgba(0,255,0,0.8)]",
    "shadow-[0_0_25px_4px_rgba(255,215,0,0.6)]",
    "shadow-[0_0_25px_4px_rgba(255,0,0,0.6)]",
    "shadow-[0_0_25px_4px_rgba(100,100,255,0.4)]",
  ],
  plugins: [],
};
