/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Token dari Figma: Desktop / 00 Welcome Landing
        chord: {
          bg: '#0e100f',
          surface: '#1b1f1c',
          border: '#303833',
          text: '#f5f7f5',
          muted: '#9ea6a3',
          green: '#1dc354',
        },
        // Token dari Figma: Desktop / 12 Login
        auth: {
          bg: '#121212',
          panel: '#183c29',
          input: '#242424',
          muted: '#b3b3b3',
          mint: '#cdebd8',
          green: '#1db954',
        },
        // Token dari Figma: canvas "Desktop UI" (Home, Song Library, dll)
        app: {
          bg: '#121212',
          sidebar: '#181818',
          card: '#242424',
          elevated: '#282828',
          border: '#333333',
          search: '#242242',
          text: '#ffffff',
          muted: '#b3b3b3',
          accent: '#1db954',
          verified: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
