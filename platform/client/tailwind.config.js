/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background, #0a0a0f)',
        surface: 'var(--color-surface, #12121a)',
        border: 'var(--color-border, #1a1a2e)',
        primary: 'var(--color-primary, #00d4ff)',
        secondary: 'var(--color-secondary, #0066ff)',
        accent: 'var(--color-accent, #ff3366)',
        success: 'var(--color-success, #00ff88)',
        warning: 'var(--color-warning, #ffaa00)',
      },
      fontFamily: {
        sans: ['var(--font-body, Inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display, Rajdhani)', 'sans-serif'],
        mono: ['var(--font-mono, JetBrains Mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
