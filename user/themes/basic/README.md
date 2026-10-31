# Basic Theme

The **Basic** Theme is for [Grav CMS](https://github.com/getgrav/grav). It uses [Tailwind CSS](https://tailwindcss.com/) for utility styles and [daisyUI](https://daisyui.com/) for theme-aware components.

## Description

The source stylesheet is `src/theme.css`. Tailwind builds it into `assets/css/theme.css`, which the theme loads. The default daisyUI theme is `light`, and `dark` is available through `data-theme="dark"`.

Theme assets live in `assets/`: compiled stylesheets in `css/`, scripts in `js/`, fonts in `fonts/`, and the existing theme artwork and logo in `media/`. The `images/`, `audio/`, `videos/`, and `documents/` folders are available for additional theme assets.

## Development

Install the theme's Node.js development dependencies and build the stylesheet:

```sh
npm install
npm run build
```

To rebuild the stylesheet as source files change, run:

```sh
npm run watch:css
```

Tailwind scans this theme's Twig templates and Grav page content under `user/pages` for utility classes.

## Modular pages and reusable components

The homepage uses Grav's modular page collection. Keep module folders prefixed with `_` and name each Markdown file after its module template, for example `_hero/hero.md`. The module template adapters in `templates/modular/` render the reusable components from `templates/partials/components/`. The `card` and `button` components are reusable inside other components. The shared site header, navigation, and footer live in `templates/partials/` and are included by the base layout.
