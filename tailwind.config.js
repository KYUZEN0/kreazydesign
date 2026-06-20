/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F6F2",
        surface: "#FFFFFF",
        ink: "#14161A",
        "ink-soft": "#5B5F6B",
        blue: {
          DEFAULT: "#2A3EFF",
          deep: "#161D8C",
        },
        highlight: "#FFD23F",
        line: "#E2E0D8",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "crop-corner":
          "linear-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
