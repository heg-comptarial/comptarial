# <p align="center">Comptarial</p>

<p align="center">
  <b>Plateforme d'échange sécurisé de documents pour fiduciaires</b><br>
  <i>Projet HEG Genève – 64-56</i>
</p>

---

## Sommaire

- [Comptarial](#comptarial)
  - [Sommaire](#sommaire)
  - [Présentation](#présentation)
  - [Fonctionnalités](#fonctionnalités)
  - [Prérequis](#prérequis)
  - [Démarrage rapide](#démarrage-rapide)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Stack technique](#stack-technique)

## Présentation

Comptarial est une plateforme de gestion d'échange de documents pour la fiduciaire Comptarial, permettant aux clients et aux fiduciaires d'échanger des documents en toute sécurité. Ce projet, développé dans le cadre du cours 64-56 – Projet de développement sur mandat à la Haute école de gestion de Genève (HEG), vise à créer une interface fluide et intuitive pour faciliter l'interaction entre les utilisateurs et la fiduciaire.

**Membres de l'équipe de développement :**

- PEREIRA Christopher
- MAHMOUD Khloud
- KAHRIMANOVIC Hakija
- UZUN Boran

## Fonctionnalités

- Authentification sécurisée
- Gestion des utilisateurs
- Téléversement et téléchargement de documents
- Notifications
- Interface moderne et responsive

## Prérequis

- Node.js >= 18.x
- npm >= 9.x
- PHP >= 8.1
- Composer >= 2.x
- MySQL ou autre base de données compatible

## Démarrage rapide

### Frontend

1. Installe les dépendances :

   ```bash
   npm install
   ```

2. Lance le serveur de développement :

   ```bash
   npm run dev
   ```

3. Variables d'environnement :
   - Crée un fichier `.env` à la racine du frontend et copie le contenu de `.env.example`.
   - Configure l'URL de l'API pour pointer vers ton backend.

### Backend

1. Va dans le dossier backend et installe les dépendances :

   ```bash
   cd backend
   composer install
   ```

2. Exécute les migrations pour créer la base de données :

   ```bash
   php artisan migrate
   ```

3. Lance le serveur backend :

   ```bash
   php artisan serve
   ```

4. Variables d'environnement :
   - Crée un fichier `.env` à la racine du backend et copie le contenu de `.env.example`.
   - Configure la connexion à la base de données et les autres variables nécessaires.

## Stack technique

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Laravel](https://laravel.com/)
