/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        // "navbp": "830px", // Moved to extend.screens
        "2xl": "1400px", // Keep 2xl here if only for container max-width
      },
    },
    screens: { // Define directly under theme.screens
      "navbp": "830px",
      // Add back sm, md, lg, xl, 2xl if needed later
    },
    extend: {
      // screens object removed from extend
      fontFamily: {
        // Link Tailwind's 'sans' utility to your CSS variable
        sans: ["var(--font-geist-sans)", 'system-ui', 'sans-serif'],
        // Link Tailwind's 'mono' utility to your CSS variable
        mono: ["var(--font-geist-mono)", 'monospace'],
        // Removed custom font family
      },
      // Add other theme extensions if needed (colors, keyframes, etc.)
      // colors: { ... },
      // keyframes: { ... },
      // animation: { ... },
    },
  },
  plugins: [require("tailwindcss-animate")], // Assuming you might use this based on shadcn components
};

export default config;