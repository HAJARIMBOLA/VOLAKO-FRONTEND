# VOLAKO — Frontend

Interface Next.js pour VOLAKO, l'application de gestion financière personnelle. Consomme l'API REST du [backend Spring Boot](../backend) déployé séparément.

**Périmètre actuel : V1** — authentification, comptes, catégories, transactions, dashboard.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, Radix UI primitives, IBM Plex Sans/Mono
- react-hook-form + Zod pour les formulaires
- Server Actions pour toutes les mutations (pas de client-side JWT)

## Architecture d'authentification

Les tokens JWT du backend ne touchent jamais le JavaScript client : ils sont stockés dans des cookies **httpOnly**, posés par des Server Actions (`src/actions/auth.ts`). `src/proxy.ts` (le `middleware.ts` de Next 16, renommé) protège les routes `/dashboard`, `/accounts`, `/categories`, `/transactions` et rafraîchit le token d'accès de façon proactive avant qu'il n'expire.

Toute lecture de données passe par des fonctions serveur (`src/lib/data/*.ts`) appelées depuis des Server Components — jamais de fetch direct depuis le navigateur vers le backend.

## Lancer en local

```bash
cp .env.example .env.local   # renseigner BACKEND_URL si différent de localhost:8080
npm install
npm run dev
```

Le backend (voir `../backend`) doit tourner sur `BACKEND_URL` (`http://localhost:8080` par défaut).

## Déploiement (Vercel)

Variable d'environnement à définir dans le dashboard Vercel :

| Variable | Description |
|---|---|
| `BACKEND_URL` | URL publique du backend Render (ex. `https://volako-backend.onrender.com`) |

Le backend doit avoir `FRONTEND_URL` pointé vers l'URL Vercel pour que CORS fonctionne.
