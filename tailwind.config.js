module.exports = {
  content: [
    './src/**/*.{js,jsx}', // Asegúrate de que las rutas coincidan con la estructura de tu proyecto
    './public/**/*.html'
  ],
  theme: {
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular']
    },
    extend: {}
  },
  plugins: []
};