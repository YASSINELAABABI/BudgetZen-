
![BudgetZen hero](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

# BudgetZen

BudgetZen est une application de pilotage financier qui combine un backend Laravel et un frontend React (Vite + Tailwind CDN). Elle propose l authentification via tokens Sanctum, la gestion des depenses et charges avec persistance SQLite, ainsi qu une interface moderne responsive.

## Architecture

- `backend/` : API Laravel 10 (Sanctum, SQLite, resources JSON typées)
- `src/` : application React + TypeScript avec routing, contexts globaux (auth, data) et nouvelles vues UI
- `node_modules/` : dependances front (React 19, lucide-react, recharts, react-hook-form, clsx, etc.)

## Installation rapide

### 1. Backend Laravel

```bash
cd backend
copy .env.example .env   # Windows
# ou: cp .env.example .env

# Installez les dependances PHP
composer install

# Genere la clef d application
php artisan key:generate

# Cree la base SQLite
php artisan migrate --seed

# Lancez le serveur API
php artisan serve
```

Par defaut l API ecoute sur `http://127.0.0.1:8000`.

### 2. Frontend React

```bash
cd ..
npm install
copy .env.example .env   # ou cp .env.example .env
npm run dev
```

L interface est disponible sur `http://127.0.0.1:5173` et consomme automatiquement l API definie dans `VITE_API_URL`.

## Identifiants de demo

Les seeds generent un utilisateur de demonstration :

- Email : `demo@budgetzen.test`
- Mot de passe : `password`

## Scripts utiles

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur Vite |
| `npm run build` | Cree un build de production |
| `php artisan test` | Lance les tests Laravel |
| `php artisan migrate:fresh --seed` | Reinitialise et reseede la base |

## Points notables

- Authentification par tokens Sanctum (login, register, logout, me)
- Resources API renvoyant des montants numeriques pour le frontend
- Contexts React pour l auth et les donnees, avec gestion des erreurs et loaders
- Nouveaux formulaires depenses/charges (React Hook Form, validation temps reel)
- Dashboard modernise : cartes resume, graphiques, liste transactions, charges imminentes
- Theme clair/sombre global avec preference persistante

## Prochaines etapes suggerées

- Ajouter les notifications email push pour les charges imminentes
- Connecter un veritable service d authentification multi-utilisateurs (verification, reset password)
- Deployer le backend sur Laravel Vapor / Forge et servir le frontend via build statique
