/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'qp': '#265073',
        'admin': ' #4B4B4B'
      },
    },
  },
  plugins: [],
}

