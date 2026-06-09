@AGENTS.md

# CLAUDE.md

## Project Overview

A Hebrew-language recipe suggestion app. The user enters ingredients they have at home, selects a cuisine type, and the app uses OpenAI (GPT-4) to suggest matching recipes. Users can rate recipes they've tried and save favourites. All data is stored in localStorage for now — database migration comes later.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router only — no Pages Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **AI:** OpenAI API (GPT-4o) via `openai` npm package
- **Persistence:** localStorage (no database yet — do not introduce one without asking)
- **Authentication:** None for now — single user per browser
- **Deployment:** Vercel
- **Package manager:** npm
- **Linting / formatting:** ESLint + Prettier

---

## Language & RTL

- The **entire UI is in Hebrew** — all labels, buttons, placeholders, messages, and errors.
- The layout is **RTL (right-to-left)**. Set `dir="rtl"` on the root `<html>` element in `/app/layout.tsx`.
- Use `font-family: 'Rubik', sans-serif` (load from Google Fonts) — it renders Hebrew cleanly.
- Tailwind RTL: use `rtl:` variants where needed. Avoid hardcoded `left`/`right` — prefer `start`/`end` logical properties.
- Do not use English anywhere in the UI. If you are unsure of a Hebrew translation, ask.
- AI prompts sent to OpenAI should instruct the model to **respond in Hebrew**.

---

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server (localhost:3000)
npm run build      # production build
npm run lint       # run ESLint
npm run typecheck  # TypeScript check (no emit)
```

---

## Features

### 1. Ingredient Input
- Free-text input where the user types ingredients they have at home
- Ingredients added as removable tags/chips
- Hebrew placeholder: "הוסף מצרך..."

### 2. Cuisine Type Selector
Fixed list — user picks one (or "הכל" for no preference):
- הכל (all / no preference)
- איטלקית
- אסייתית
- ים תיכונית
- מזרח תיכונית
- אמריקאית
- הודית
- מקסיקנית
- צרפתית

### 3. Recipe Suggestions
- On submit, call OpenAI API and display 3 recipe suggestions
- Each recipe card shows: name, short description, ingredients used, estimated prep time, difficulty
- Show a loading state while waiting for the API
- Handle errors gracefully with a Hebrew error message

### 4. Ratings
- Each recipe can be rated 1–5 stars
- Ratings are saved in localStorage
- Previously rated recipes show their saved rating

### 5. Favourites
- Each recipe has a "שמור למועדפים" (save to favourites) button
- Favourites are saved in localStorage
- A separate "המועדפים שלי" (My Favourites) page lists all saved recipes
- Favourites can be removed

---

## OpenAI Integration

- API calls are made from a **Route Handler** (`/app/api/recipes/route.ts`) — never from the client directly.
- The OpenAI secret key lives in `.env.local` as `OPENAI_API_KEY` — never expose it to the client.
- Use `gpt-4o` as the model.
- The prompt must instruct the model to:
  - Respond entirely in Hebrew
  - Return structured JSON (see schema below)
  - Suggest recipes that realistically match the given ingredients
  - Respect the selected cuisine type

### Response Schema (instruct the model to return this exact JSON)

```json
{
  "recipes": [
    {
      "id": "unique-string",
      "name": "שם המתכון",
      "description": "תיאור קצר",
      "cuisine": "איטלקית",
      "ingredients": ["מצרך 1", "מצרך 2"],
      "missingIngredients": ["מצרך חסר"],
      "steps": ["שלב 1", "שלב 2"],
      "prepTime": "30 דקות",
      "difficulty": "קל"
    }
  ]
}
```

- Parse and validate the JSON response before rendering — handle malformed responses gracefully.
- Do not call the API on every keystroke — only on explicit form submission.

---

## localStorage Structure

```typescript
// Favourites — key: "favourites"
type Favourite = {
  id: string
  name: string
  description: string
  cuisine: string
  ingredients: string[]
  steps: string[]
  prepTime: string
  difficulty: string
  savedAt: string // ISO date
}

// Ratings — key: "ratings"
type Ratings = {
  [recipeId: string]: number // 1–5
}
```

- Always read/write localStorage through `/lib/storage.ts` — never access it directly in components.
- localStorage is browser-only — always guard with `typeof window !== "undefined"` or use `useEffect`.

---

## File Structure

```
/app
  /api/recipes        — OpenAI Route Handler
  /favourites         — My Favourites page
  layout.tsx          — sets dir="rtl", loads Rubik font
  page.tsx            — main ingredient input + results page
/components
  /ui                 — Button, Tag, StarRating, RecipeCard, LoadingSpinner
  /features
    IngredientInput.tsx
    CuisineSelector.tsx
    RecipeList.tsx
    FavouritesList.tsx
/lib
  openai.ts           — OpenAI client (single instance)
  storage.ts          — all localStorage read/write functions
/types
  recipe.ts           — shared TypeScript types
```

---

## Environment Variables

```bash
# .env.local
OPENAI_API_KEY=        # from OpenAI dashboard — server only, never expose to client
NEXT_PUBLIC_APP_URL=   # e.g. http://localhost:3000
```

---

## Error Handling

- All Route Handlers must have a top-level try/catch returning `{ error: { message: string } }`.
- Show Hebrew error messages in the UI — never expose raw API errors to the user.
- If OpenAI returns malformed JSON, show: "לא הצלחנו לקבל מתכונים, נסה שוב"
- If the API key is missing, throw a clear server-side error (do not silently fail).

---

## Critical Rules

1. **Never expose `OPENAI_API_KEY` to the client** — all OpenAI calls go through the Route Handler.
2. **All UI text in Hebrew** — no English visible to the user anywhere.
3. **RTL layout always** — test that nothing breaks visually in RTL before considering a task done.
4. **localStorage only** — do not introduce a database or backend persistence without asking.
5. **Ask before installing packages** — explain what the package does and why it is needed.
6. **Ask before deleting files** — wait for explicit confirmation.
7. **When in doubt, ask** — one clarifying question before writing code.

---

## Future (do not build yet)

- User authentication (Clerk)
- Database persistence (Supabase) — replace localStorage calls in `/lib/storage.ts`
- Recipe sharing between users
- Shopping list for missing ingredients
- Weekly meal planner

## Design
- Inspired by Wolt's UI — clean white cards, bold blue hero header (#009DE0), pill-shaped chips
- Recipe cards have a colorful gradient image area, meta info row, star rating, and favourite button
- Navbar: logo on the right, favourites + login on the left (RTL)
- Ingredient input lives in the hero section, cuisine chips below it