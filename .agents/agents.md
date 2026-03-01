# Split Expense — Agent Rules

> Règles strictes et non-négociables pour tout agent IA travaillant sur ce projet.
> Ces règles s'appliquent à 100% du code produit, sans exception.

---

## 🏗️ Stack Technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript |
| Routing | Single-page (App.tsx) |
| Styling | Tailwind CSS v4 (vanilla) |
| Animations | `motion/react` (Framer Motion) |
| Backend | Firebase Firestore |
| Validation | Zod |
| Build | Vite |
| Hébergement | Vercel (plan gratuit) |

---

## 📁 Structure du Projet

```
src/
├── components/       # Composants React (max 7 par dossier)
├── lib/              # Outils partagés, config Firebase, schémas Zod
│   ├── firebase.ts   # Instance Firestore (singleton)
│   ├── schema.ts     # Schémas Zod (source de vérité du typage)
│   └── utils.ts      # Utilitaires génériques (ex: cn())
├── services/
│   └── api/          # Une fonction par fichier, organisée par entité
│       ├── accounts/ # create-account, fetch-accounts, update-account, delete-account
│       ├── expenses/ # create-expense, fetch-expenses, update-expense, delete-expense
│       └── users/    # fetch-users, update-user
├── types/
│   └── index.ts      # Types TypeScript (dérivés des schémas Zod si possible)
├── App.tsx           # Composant racine, orchestration de l'état
└── main.tsx          # Point d'entrée React
```

---

## ✅ Règles de Code

### Nommage
- **Fichiers** : `kebab-case` (ex: `create-expense.ts`, `transfer-summary.tsx`)
- **Fonctions / Variables** : `camelCase` (ex: `fetchExpenses`, `isLoading`)
- **Types / Interfaces** : `PascalCase` (ex: `User`, `ExpenseDTO`)
- **Constantes globales** : `UPPER_SNAKE_CASE` (ex: `FIRESTORE_COLLECTION`)
- **Composants** : `PascalCase` (ex: `TransferSummary`)
- **Pattern functions** : verbe + entité (ex: `createExpense`, `deleteAccount`)

### Organisation
- **Max 7 fichiers par dossier** — créer un sous-dossier si dépassé.
- **Une seule fonction/composant exporté par fichier.**
- **Zéro import mort** — tout import doit être utilisé.
- **Zéro variable inutilisée** — le compilateur TypeScript valide en mode strict.

### TypeScript
- **Aucun `any`**, jamais. Utiliser `unknown` si nécessaire.
- Types inférés quand évident, explicites quand ambigu.
- Les types sont dérivés des schémas Zod via `z.infer<typeof Schema>`.
- Le fichier `src/types/index.ts` est la source de vérité pour tous les types partagés.

### Fonctions
- **JSDoc obligatoire** sur toutes les fonctions exportées :
  ```ts
  /**
   * Crée une nouvelle dépense dans Firestore.
   * @param expenseData - Les données de la dépense (sans ID)
   * @returns La dépense créée avec son ID
   */
  export const createExpense = async (...) => { ... };
  ```
- Les fonctions asynchrones gèrent **toujours** leurs erreurs avec `try/catch`.
- Pas de `console.log` en production — utiliser `console.error` uniquement pour les erreurs.

### Données & API
- **Zéro données mockées** — aucun usage de `localStorage`, de données statiques fictives ou de `setTimeout` artificiel.
- Toutes les lectures/écritures passent par les fonctions dans `src/services/api/`.
- Validation Zod **obligatoire** à chaque mutation (create/update).
- Les IDs sont générés avec `crypto.randomUUID()`.

### Composants React
- **Props typées** via une `interface` locale au composant (ex: `interface CalendarProps { ... }`).
- Aucune logique métier dans un composant — la déléguer aux services ou à `App.tsx`.
- Animations via `motion/react` uniquement — pas de CSS `transition` manuels pour les animations complexes.
- Les composants passent des callbacks, ne font pas leurs propres appels API.

### Sécurité
- **Propriété vérifiée** : un utilisateur ne peut modifier que ses propres ressources.
- Les règles Firestore sont en production et restrictives (pas de `allow read, write: if true`).
- Aucune clé API ne doit être committée sans passer par `.env`.

---

## 🚫 Interdits

- `any` — jamais.
- `// TODO` / `// FIXME` — résoudre avant de committer.
- Code commenté — supprimer le code mort, ne pas le commenter.
- `localStorage` comme base de données — Firestore uniquement.
- Dépendances non utilisées dans `package.json`.
- `console.log` en dehors du débogage temporaire.
- Composants de plus de ~250 lignes — factoriser.

---

## 🎨 Design (Apple-like)

- Police : SF Pro Display / SF Pro Text (pile système : `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- Couleurs système iOS : `#007AFF` (bleu), `#FF3B30` (rouge), `#34C759` (vert), `#8E8E93` (gris)
- Fond : `#F2F2F7` (gris système clair)
- Border-radius : `rounded-[24px]` pour les cartes, `rounded-full` pour les avatars/boutons circulaires
- Ombres : légères, `shadow-sm ring-1 ring-black/[0.03]`
- Glassmorphism sur le header : `bg-[#F2F2F7]/80 backdrop-blur-2xl`
- Toutes les animations : `motion/react`, courbes `easeOut`, durée ≤ 400ms
- Mobile-first : safe area insets obligatoires (`env(safe-area-inset-*)`)

---

## 🔥 Firebase / Firestore

- L'instance `db` est un singleton exporté depuis `src/lib/firebase.ts`.
- Collections : `users`, `accounts`, `expenses` — l'ID du document Firestore = l'ID de l'entité.
- Règles Firestore déployées via `firebase deploy --only firestore:rules`.
- Aucune écriture directe Firestore en dehors de `src/services/api/`.

---

## 🚀 Commandes Utiles

```bash
npm run dev      # Dev server (port 3000)
npm run lint     # Vérification TypeScript stricte
npm run build    # Build de production
firebase deploy --only firestore:rules  # Déployer les règles Firestore
```
