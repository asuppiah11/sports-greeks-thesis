/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'syracuse-orange': '#F76900',
        'syracuse-navy':   '#000E54',
        'terminal-bg':     '#0a0a0a',
        'terminal-panel':  '#111111',
        'terminal-border': '#1f1f1f',
        'terminal-text':   '#e5e5e5',
        'terminal-muted':  '#8a8a8a',
        'terminal-dim':    '#666666',
        'terminal-orange': '#ff8a1a',
        'terminal-cyan':   '#4ec9ff',
        'terminal-green':  '#4ade80',
        'terminal-red':    '#f87171',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
