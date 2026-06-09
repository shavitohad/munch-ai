'use client'

import { useState } from 'react'

type Props = {
  recipeId: string
  initial?: number
  onRate: (recipeId: string, rating: number) => void
}

export default function StarRating({ recipeId, initial, onRate }: Props) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || initial || 0

  return (
    <div className="flex gap-0.5" aria-label="דירוג">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(recipeId, star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} כוכבים`}
          className="text-xl leading-none transition-transform hover:scale-110"
        >
          <span className={star <= active ? 'text-amber-400' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  )
}
