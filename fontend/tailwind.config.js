/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  theme: {
    extend: {
      backgroundImage: {
        'background-image': "url('./public/image/office_laptop-wallpaper-2000x1333.jpg')",
        'logo-image': "url('./public/image/vecteezy_flat-icon-bank-bank-icon-where-to-keep-money-illustration_20716209.png')",
        
      }
    },
  },
  plugins: [require("daisyui")],
}