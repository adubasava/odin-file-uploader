/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      backgroundPosition: {
        'right-top': 'right 2rem top',
      },
      colors(theme) {
        return {
          primary: {
            DEFAULT: 'hsl(10, 38%, 56%)',
            dark: 'hsl(10, 28%, 31%)',
            blackish: 'hsl(3, 27%, 34%)',
            congo: 'hsl(3, 27%, 34%)',
            ligth: 'hsl(3, 35%, 82%)',
            green: 'hsl(136, 45%, 30%)',
            greenligth: 'hsl(134, 50%, 85%)',
            red: 'hsl(356, 53%, 42%)',
            redligth: 'hsl(4, 61%, 90%)',
          },
          gray: {
            ...theme.colors.gray,
            100: 'hsl(0, 0%, 81%)',
            200: 'hsl(210, 46%, 95%)',
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
