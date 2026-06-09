'use client'

import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react'

type Props = {
  ingredients: string[]
  onAdd: (ingredient: string) => void
  onRemove: (ingredient: string) => void
}

export default function IngredientInput({ ingredients, onAdd, onRemove }: Props) {
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed && !ingredients.includes(trimmed)) {
      onAdd(trimmed)
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setAnalyzing(true)
    setAnalysisError('')

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await fetch('/api/identify-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setAnalysisError(data.error?.message ?? 'לא הצלחנו לזהות מצרכים, נסה שוב')
        return
      }

      // Add identified ingredients, skipping duplicates within the batch and against existing
      const added = new Set<string>(ingredients)
      for (const ing of data.ingredients as string[]) {
        if (ing && !added.has(ing)) {
          onAdd(ing)
          added.add(ing)
        }
      }
    } catch {
      setAnalysisError('לא הצלחנו לזהות מצרכים, נסה שוב')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">מצרכים</label>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הוסף מצרך..."
          className="min-w-[140px] flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-[#009DE0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#009DE0]/20"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          className="rounded-xl bg-[#009DE0] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0081BD] disabled:cursor-not-allowed disabled:opacity-50"
        >
          הוסף
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={analyzing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#009DE0] px-4 py-2.5 text-sm font-semibold text-[#009DE0] transition-colors hover:bg-[#E6F6FD] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {analyzing ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#009DE0]/30 border-t-[#009DE0]" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
              <path
                fillRule="evenodd"
                d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.316c.24.383.645.643 1.11.71.98.138 1.94.337 2.886.598A2.25 2.25 0 0 1 23.25 9v9.75A2.25 2.25 0 0 1 21 21H3a2.25 2.25 0 0 1-2.25-2.25V9A2.25 2.25 0 0 1 2.395 6.79c.946-.26 1.906-.46 2.886-.598a1.5 1.5 0 0 0 1.11-.71l.821-1.315a2.75 2.75 0 0 1 2.132-1.406Zm6.156 5.429a5.25 5.25 0 1 0-7 7.833 5.25 5.25 0 0 0 7-7.833Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {analyzing ? 'מנתח...' : 'צלם מקרר'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {analysisError && (
        <p className="text-sm text-red-500">{analysisError}</p>
      )}

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <span
              key={ing}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#009DE0]/20 bg-[#E6F6FD] px-3 py-1 text-sm font-medium text-[#009DE0]"
            >
              {ing}
              <button
                type="button"
                onClick={() => onRemove(ing)}
                aria-label={`הסר ${ing}`}
                className="leading-none text-[#009DE0]/60 transition-colors hover:text-[#009DE0]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
