'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'
import { isFavourite, saveFavourite, removeFavourite, getRating, setRating } from '@/lib/storage'
import type { Recipe } from '@/types/recipe'

const GRADIENTS = [
  'from-orange-400 to-pink-500',
  'from-green-400 to-teal-500',
  'from-purple-400 to-indigo-500',
]

type Props = {
  recipe: Recipe
  index: number
}

export default function RecipeCard({ recipe, index }: Props) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [fav, setFav] = useState(false)
  const [rating, setRatingState] = useState<number | undefined>()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setFav(isFavourite(recipe.id))
    setRatingState(getRating(recipe.id))
  }, [recipe.id])

  function toggleFav() {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
    if (fav) {
      removeFavourite(recipe.id)
      setFav(false)
    } else {
      saveFavourite({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        cuisine: recipe.cuisine,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        savedAt: new Date().toISOString(),
      })
      setFav(true)
    }
  }

  function handleRate(id: string, stars: number) {
    setRating(id, stars)
    setRatingState(stars)
  }

  const gradient = GRADIENTS[index % GRADIENTS.length]
  const difficultyColor =
    recipe.difficulty === 'קל'
      ? 'text-green-700 bg-green-50'
      : recipe.difficulty === 'בינוני'
        ? 'text-amber-700 bg-amber-50'
        : 'text-red-700 bg-red-50'

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-lg">
      <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-5xl">🍽️</span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight text-gray-900">{recipe.name}</h3>
          <button
            type="button"
            onClick={toggleFav}
            aria-label={fav ? 'הסר ממועדפים' : 'שמור למועדפים'}
            className={`shrink-0 text-2xl transition-transform hover:scale-110 ${fav ? 'text-[#009DE0]' : 'text-gray-300'}`}
          >
            {fav ? '♥' : '♡'}
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500">{recipe.description}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
            ⏱ {recipe.prepTime}
          </span>
          <span className={`rounded-full px-2.5 py-1 font-medium ${difficultyColor}`}>
            {recipe.difficulty}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
            🍴 {recipe.cuisine}
          </span>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            מצרכים
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-[#009DE0]/20 bg-[#E6F6FD] px-2.5 py-0.5 text-xs text-[#009DE0]"
              >
                {ing}
              </span>
            ))}
            {recipe.missingIngredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-400 line-through"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {recipe.steps.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="mt-4 text-sm font-medium text-[#009DE0] hover:underline"
          >
            {expanded ? 'הסתר הוראות הכנה ▲' : 'הצג הוראות הכנה ▼'}
          </button>
        )}
        {expanded && (
          <ol className="mt-3 space-y-2 text-sm text-gray-700" dir="rtl">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-bold text-[#009DE0]">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-400">דרג את המתכון</span>
          <StarRating recipeId={recipe.id} initial={rating} onRate={handleRate} />
        </div>
      </div>
    </div>
  )
}
