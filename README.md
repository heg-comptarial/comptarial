# <p align="center">Comptarial</p>

Comptarial est une plateforme de gestion d'échange de documents pour la fiduciaire Comptarial, permettant aux clients et aux fiduciaires d'échanger des documents en toute sécurité. Ce projet, développé dans le cadre du cours 64-56 – Projet de développement sur mandat à la Haute école de gestion de Genève (HEG), vise à créer une interface fluide et intuitive pour faciliter l'interaction entre les utilisateurs et la fiduciaire.

Les membres de l'équipe de développement sont :

PEREIRA Christopher,
MAHMOUD Khloud,
KAHRIMANOVIC Hakija,
UZUN Boran

## Getting started

First, install the dependencies.

```bash
npm install
```

Then, run the developpement server

```bash
npm run dev
```

```bash
cd backend
composer install
php artisan api:install (au cas les routes /api marchent pas, faire cette commande)
php artisan migrate:refresh --seed  
```

## Tech Stack

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Laravel](https://laravel.com/)

## Vitest

- npm install react-day-picker@latest            
- npm install -D vite @vitejs/plugin-react 
- npm install -D vitest happy-dom @testing-library/react
- npm install --save-dev @testing-library/jest-dom   
- npx vitest  (lancer les tests)
- npm list @vitejs/plugin-react (check les plugins)