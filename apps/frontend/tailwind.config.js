const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind')
const { join } = require('path')

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    ({ addVariant }) => {
      addVariant('ng-invalid', '&.ng-touched.ng-invalid')
    },
  ],
  daisyui: {
    darkTheme: false,
    // list copied from https://daisyui.com/docs/themes/ on 2023-04-10
    themes: [
      {
        stochus: {
          ...require('daisyui/src/colors/themes')['[data-theme=bumblebee]'],
          primary: '#749EBE',
          secondary: '#9BAFBF',
          accent: '#F7B1AB',
        },
      },
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
    ],
  },
}
