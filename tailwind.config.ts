import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))"
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 211, 238, 0.5)",
        card: "0 8px 32px rgba(15, 23, 42, 0.4)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(236, 72, 153, 0.3), transparent 45%), radial-gradient(circle at right, rgba(34, 211, 238, 0.35), transparent 50%)"
      },
      animation: {
        "gradient-move": "gradientMove 8s ease infinite"
      },
      keyframes: {
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      }
    }
  },
  plugins: []
};

export default config;
