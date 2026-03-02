export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./public/**/*.html" //加入這行，讓 Tailwind 掃描靜態 SEO 頁面
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}