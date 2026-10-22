/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E1118",
          900: "#141823",
          850: "#1A1F2D",
          800: "#212738",
          700: "#2D3448",
          600: "#3E4760",
        },
        fog: {
          100: "#ECEEF5",
          300: "#B9BED0",
          400: "#98A0BA",
          500: "#7F86A0",
        },
      },
      fontFamily: {
        sans: ["Onest", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', "Onest", "ui-sans-serif", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 80%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "40%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: { blink: "blink 1.2s infinite ease-in-out" },
    },
  },
  plugins: [],
};
