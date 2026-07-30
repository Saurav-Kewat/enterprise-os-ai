/** @type {import('tailwindcss').Config} */
module.exports = {
  // Always-dark — use "class" strategy with the `dark` class forced on <html>
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-ibm-plex)", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        background: "#0B0F19",
        sidebar: "#111827",
        card: "#161B22",
        primary: {
          DEFAULT: "#0F62FE",
          hover: "#0353E9",
          foreground: "#FFFFFF",
        },
        border: "#243244",
        success: "#24A148",
        warning: "#F1C21B",
        destructive: "#DA1E28",
        muted: {
          DEFAULT: "#161B22",
          foreground: "#94A3B8",
        },
        secondary: {
          DEFAULT: "#94A3B8",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#1D2D44",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#161B22",
          foreground: "#FFFFFF",
        },
        foreground: "#FFFFFF",
        input: "#243244",
        ring: "#0F62FE",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
