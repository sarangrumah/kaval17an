/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // Merah resmi logo HUT RI (ED1C24) beserta turunan gelapnya.
        merah: { DEFAULT: "#ED1C24", tua: "#C0151B", pekat: "#8F0F14" },
      },
      keyframes: {
        kibar: {
          "0%, 100%": { transform: "rotate(-2.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
        melayang: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        goyang: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        muncul: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        jatuh: {
          "0%": { transform: "translateY(-10%) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(660px) rotate(540deg)", opacity: "0" },
        },
        kelip: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        geser: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        detak: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        kibar: "kibar 2.6s ease-in-out infinite",
        melayang: "melayang 5s ease-in-out infinite",
        goyang: "goyang 3.6s ease-in-out infinite",
        muncul: "muncul 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        jatuh: "jatuh 7s linear infinite",
        kelip: "kelip 2.4s ease-in-out infinite",
        geser: "geser 24s linear infinite",
        detak: "detak 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
