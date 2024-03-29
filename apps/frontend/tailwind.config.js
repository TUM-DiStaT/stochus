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
    require('@tailwindcss/typography'),
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
        // color palette: https://coolors.co/749EBE-9BAFBF-F7B1AB
        // (extra colors used in charts)
        stochus: {
          ...require('daisyui/src/theming/themes')['bumblebee'],
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
