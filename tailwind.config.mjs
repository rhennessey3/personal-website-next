/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
	safelist: [
	  'bg-rh-black',
	  'text-rh-white',
	  'bg-rh-grey',
	  'text-rh-black',
	  'bg-rh-white',
	  // text-rh-black is already covered by grey/white, but explicit doesn't hurt
	],
	prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: { // Define custom breakpoints, overriding defaults
      'xs': '376px',
      'sm': '640px',  // Standard sm
      'md': '768px',
      'navbp': '830px', // Custom nav breakpoint
      'lg': '1024px', // Standard lg
      'xl': '1200px', // New breakpoint for slider
      '2xl': '1400px', // Standard 2xl (matches container setting)
    },
    extend: {
      // screens object should not be duplicated here if defined under theme.screens directly
      fontFamily: {
        // Link Tailwind's 'sans' utility to your CSS variable
        sans: ["var(--font-geist-sans)", 'system-ui', 'sans-serif'],
        // Link Tailwind's 'mono' utility to your CSS variable
        mono: ["var(--font-geist-mono)", 'monospace'],
        // Removed custom font family
      },
      // Add other theme extensions if needed (colors, keyframes, etc.)
      colors: {
        'rh-black': '#151515',
        'rh-grey': '#F0F0F0',
        'rh-white': '#FCFCFC',
      },
      // keyframes: { ... },
      // animation: { ... },
    },
  },
  plugins: [require("tailwindcss-animate")], // Assuming you might use this based on shadcn components
};

export default config;