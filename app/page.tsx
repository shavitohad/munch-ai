'use client'

import { useState } from 'react'
import IngredientInput from '@/components/features/IngredientInput'
import CuisineSelector from '@/components/features/CuisineSelector'
import RecipeList from '@/components/features/RecipeList'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { type Cuisine, type Recipe } from '@/types/recipe'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; recipes: Recipe[] }
  | { status: 'error'; message: string }

export default function HomePage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [cuisine, setCuisine] = useState<Cuisine>('הכל')
  const [notes, setNotes] = useState('')
  const [state, setState] = useState<State>({ status: 'idle' })

  const addIngredient = (ing: string) => setIngredients((prev) => [...prev, ing])
  const removeIngredient = (ing: string) =>
    setIngredients((prev) => prev.filter((i) => i !== ing))

  async function handleSubmit() {
    if (ingredients.length === 0) return
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, cuisine, notes }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setState({ status: 'error', message: data.error?.message ?? 'לא הצלחנו לקבל מתכונים, נסה שוב' })
        return
      }
      setState({ status: 'success', recipes: data.recipes })
    } catch {
      setState({ status: 'error', message: 'לא הצלחנו לקבל מתכונים, נסה שוב' })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="px-4 pb-24 pt-14 text-white"
        style={{ background: 'linear-gradient(160deg, #009DE0 0%, #006FAA 100%)' }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">מה לבשל היום?</h1>
          <p className="mt-3 text-lg text-blue-100">
            הוסיפו מצרכים שיש לכם בבית וקבלו הצעות מתכונים בשניות
          </p>
        </div>
      </section>

      {/* Form card */}
      <div className="mx-auto -mt-14 max-w-2xl px-4 pb-10">
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
          <IngredientInput
            ingredients={ingredients}
            onAdd={addIngredient}
            onRemove={removeIngredient}
          />
          <hr className="my-5 border-gray-100" />
          <CuisineSelector selected={cuisine} onChange={setCuisine} />
          <hr className="my-5 border-gray-100" />
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700">
              הערות נוספות
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="לדוגמה: אני צמחוני, אלרגי לאגוזים, מתכון קל לילדים..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-[#009DE0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#009DE0]/20"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={ingredients.length === 0 || state.status === 'loading'}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#009DE0] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#0081BD] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state.status === 'loading' ? (
              'מחפש...'
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" />
                </svg>
                מצא מתכונים
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {state.status === 'loading' && (
        <div className="mx-auto max-w-2xl px-4">
          <LoadingSpinner />
        </div>
      )}

      {state.status === 'error' && (
        <div className="mx-auto max-w-2xl px-4 pb-10">
          <p className="rounded-xl bg-red-50 px-5 py-4 text-center text-sm text-red-600">
            {state.message}
          </p>
        </div>
      )}

      {state.status === 'success' && <RecipeList recipes={state.recipes} />}
    </div>
  )
}
