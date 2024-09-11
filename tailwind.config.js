/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      colors(theme) {
        return {
          primary: {
            congo: 'hsl(3, 27%, 34%)',
            ligth: 'hsl(3, 35%, 82%)',
            green: 'hsl(136, 45%, 30%)',
            greenligth: 'hsl(134, 50%, 85%)',
            red: 'hsl(356, 53%, 42%)',
            redligth: 'hsl(4, 61%, 90%)',
          },
        };
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('@tailwindcss/forms'),
  ],
};
