'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getFavourites, removeFavourite, getRating, setRating } from '@/lib/storage'
import StarRating from '@/components/ui/StarRating'
import type { Favourite } from '@/types/recipe'

const GRADIENTS = [
  'from-orange-400 to-pink-500',
  'from-green-400 to-teal-500',
  'from-purple-400 to-indigo-500',
]

const DIFFICULTY_COLOR: Record<string, string> = {
  קל: 'text-green-700 bg-green-50',
  בינוני: 'text-amber-700 bg-amber-50',
  מאתגר: 'text-red-700 bg-red-50',
}

type CardProps = {
  fav: Favourite
  index: number
  onRemove: (id: string) => void
}

function FavCard({ fav, index, onRemove }: CardProps) {
  const [expanded, setExpanded] = useState(false)
  const [rating, setRatingState] = useState<number | undefined>()

  useEffect(() => {
    setRatingState(getRating(fav.id))
  }, [fav.id])

  function handleRate(id: string, stars: number) {
    setRating(id, stars)
    setRatingState(stars)
  }

  const gradient = GRADIENTS[index % GRADIENTS.length]
  const diffColor = DIFFICULTY_COLOR[fav.difficulty] ?? 'text-gray-700 bg-gray-100'
  const savedDate = new Date(fav.savedAt).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-lg">
      <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-5xl">🍽️</span>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight text-gray-900">{fav.name}</h3>
          <button
            type="button"
            onClick={() => onRemove(fav.id)}
            aria-label="הסר ממועדפים"
            className="shrink-0 text-2xl text-[#009DE0] transition-transform hover:scale-110"
          >
            ♥
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500">{fav.description}</p>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
            ⏱ {fav.prepTime}
          </span>
          <span className={`rounded-full px-2.5 py-1 font-medium ${diffColor}`}>
            {fav.difficulty}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
            🍴 {fav.cuisine}
          </span>
        </div>

        {/* Ingredients */}
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            מצרכים
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fav.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-[#009DE0]/20 bg-[#E6F6FD] px-2.5 py-0.5 text-xs text-[#009DE0]"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Steps toggle */}
        {fav.steps.length > 0 && (
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
            {fav.steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-bold text-[#009DE0]">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}

        {/* Rating + saved date */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-400">נשמר ב־{savedDate}</span>
          <StarRating recipeId={fav.id} initial={rating} onRate={handleRate} />
        </div>
      </div>
    </div>
  )
}

export default function FavouritesList() {
  const [favourites, setFavourites] = useState<Favourite[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFavourites(getFavourites())
    setLoaded(true)
  }, [])

  function handleRemove(id: string) {
    removeFavourite(id)
    setFavourites((prev) => prev.filter((f) => f.id !== id))
  }

  if (!loaded) return null

  if (favourites.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-8 py-16 text-center shadow-xl ring-1 ring-black/5">
        <p className="text-5xl">🍽️</p>
        <h2 className="mt-4 text-xl font-bold text-gray-800">עדיין אין לך מועדפים</h2>
        <p className="mt-2 text-sm text-gray-500">
          חפשו מתכונים ולחצו על הלב כדי לשמור אותם כאן
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-[#009DE0] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0081BD]"
        >
          מצא מתכונים
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favourites.map((fav, i) => (
        <FavCard key={fav.id} fav={fav} index={i} onRemove={handleRemove} />
      ))}
    </div>
  )
}
