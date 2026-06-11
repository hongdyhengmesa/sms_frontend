/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        brand: {
          50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',
          400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',
          800:'#3730a3',900:'#312e81',
        },
      },
      boxShadow: {
        card:'0 1px 4px rgba(0,0,0,0.06)',
        'card-hover':'0 6px 24px rgba(0,0,0,0.10)',
        btn:'0 2px 8px rgba(79,70,229,0.30)',
      },
    },
  },
  plugins: [],
}
