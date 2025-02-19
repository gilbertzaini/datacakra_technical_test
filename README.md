# Technical Documentation

## Important Project Structure
* /src/components/ui/: imported shadcn/ui components
* /src/components/   : self-made components
* /src/pages/        : pages
* /src/pages/auth/   : authentication pages
* /src/features/     : redux slices
* /src/hooks/        : authorization middlewares
* /src/interfaces    : type interfaces
* /src/schema        : zod schema

## Tech Stack
* Vite 6.1.0
* React 19 with TypeScript
* tailwindcss v4.0
* shadcn/ui

## Project Initialization

- Create project:
  `npm create vite@latest datacakra_technical_test -- --template react-ts\n`
- Install tailwindcss:
  `npm install tailwindcss @tailwindcss/vite`
- Configure tailwindcss following the official documentation:
  <a>https://tailwindcss.com/docs/installation/using-vite</a>
- Configure shadcn following the official documentation:
  - <a>https://ui.shadcn.com/docs/installation/vite</\*a>
  - <a>https://ui.shadcn.com/docs/tailwind-v4</a>

## Project Installation
run `npm i` to install all dependencies, followed by `npm run dev` to run the app
