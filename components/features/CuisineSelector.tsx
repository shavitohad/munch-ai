'use client'

import { CUISINES, type Cuisine } from '@/types/recipe'

type Props = {
  selected: Cuisine
  onChange: (cuisine: Cuisine) => void
}

export default function CuisineSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">סוג מטבח</label>
      <div className="flex flex-wrap gap-2">
        {CUISINES.map((cuisine) => (
          <button
            key={cuisine}
            type="button"
            onClick={() => onChange(cuisine)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selected === cuisine
                ? 'shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-[#009DE0] hover:text-[#009DE0]'
            }`}
            style={
              selected === cuisine
                ? { backgroundColor: '#009DE0', color: 'white' }
                : undefined
            }
          >
            {cuisine}
          </button>
        ))}
      </div>
    </div>
  )
}
