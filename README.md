# Portfolio — Lucas Moura

Personal site: a 3D dotted bust that turns with the pointer, a short intro, selected work, side projects, stack, contact and a CV page. English by default, with a Portuguese toggle that remembers the visitor's choice.

Live at **https://mouraluck.github.io/Portfolio/**

## Stack

React 19, Vite, Tailwind CSS 4 and framer-motion. Spotlight Card, Magnetic Button and Text Scramble Decoder come from [EasyUI](https://github.com/Surajmaurya1/easyui) (MIT), copied into `src/components/ui`.

## Develop

```bash
npm install
npm run dev
```

All copy lives in `src/data/home.ts` and `src/data/cv.ts`, in both languages.

The bust is a depth map sculpted from a photo; `tools/README.md` explains how to regenerate it.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`).
