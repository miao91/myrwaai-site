/**
 * tailwind.config.cjs
 * Tailwind CSS 配置，扫描 index.html 与 src 下的组件/页面类名。
 */

module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
