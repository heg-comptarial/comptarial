# Comptarial

## ✨ Présentation du projet

Comptarial est une plateforme numérique conçue pour permettre un échange sécurisé de documents entre les fiduciaires et leurs clients. Développée dans le cadre du module 64-56 à la Haute école de gestion de Genève (HEG), cette application vise à moderniser les interactions entre les collaborateurs d'une fiduciaire et ses clients, avec une interface intuitive et une sécurité renforcée.

---

## ⚙️ Prérequis

- PHP >= 8.2
- Composer >= 2.x
- MySQL ou autre SGBD compatible
- Node.js >= 18.x
- npm >= 9.x

---

## ⚡ Installation du projet

Cloner le dépôt GitHub et suivre les instructions ci-dessous pour configurer le backend (Laravel) et le frontend (Next.js).

```bash
git clone https://github.com/heg-comptarial/comptarial
cd comptarial
```

### 🚀 Installation du frontend (Next.js)

```bash
# 1. Installer les dépendances npm
npm install

# 2. Lancer le serveur de développement
npm run dev
```

### 📅 Configuration .env

Référez-vous au fichier `.env.example` fourni pour configurer l'URL de l'API et les autres variables nécessaires.

---

### 🔧 Installation du backend (Laravel)

```bash
# 1. Accéder au dossier backend
cd backend

# 2. Copier et configurer le fichier .env
cp .env.example .env

# 3. Installer les dépendances PHP
composer install

# 5. Lancer les migrations et éventuellement les seeders
php artisan migrate --seed

# 6. Démarrer le serveur de développement
php artisan serve
```

### 🔐 Configuration .env

Référez-vous au fichier `.env.example` fourni pour renseigner les variables d'environnement nécessaires à l'exécution du projet.

---

## 🌐 Fonctionnalités principales

- 🔐 Authentification sécurisée avec rôles
- 👥 Gestion des utilisateurs et des clients
- 📂 Téléversement et téléchargement sécurisés de fichiers
- 📢 Système de notifications et d'envoi de mail

---

## 🚀 Routes principales de l'API REST

```http
POST  /api/login
POST  /api/logout
GET   /api/users
GET   /api/prives
GET   /api/documents
POST  /api/documents
GET   /api/declarations
PUT   /api/declarations/{declaration}
```

> Exécutez `php artisan route:list` pour voir la liste complète.

---

## 📊 Stack technique

- **Frontend** : Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** : Laravel 12+, Laravel Sanctum, Laravel Mail, MySQL

---

## 🔧 Tests

Pour exécuter les tests unitaires Laravel :

```bash
php artisan test
```

Des tests Cypress côté frontend peuvent être ajoutés dans les prochaines versions.

---

## 🚗 Déploiement

```bash
php artisan migrate --force
php artisan config:cache
```

Configurez les fichiers `.env` de production et assurez-vous de sécuriser votre environnement (HTTPS, firewall, etc.).

---

## 📝 Équipe de développement

- **Christopher Pereira**
- **Khloud Mahmoud**
- **Hakija Kahrimanovic**
- **Boran Uzun**

---

## 💡 Remarques

- Tous les documents sont stockés dans un bucket S3 infomaniak.
- Utilisation de reCAPTCHA v3 pour la sécurité du formulaire de contact.
