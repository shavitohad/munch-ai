import type { Favourite, Ratings } from '@/types/recipe'

const isBrowser = typeof window !== 'undefined'

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser) return
  localStorage.setItem(key, JSON.stringify(value))
}

// Favourites
export function getFavourites(): Favourite[] {
  return read<Favourite[]>('favourites', [])
}

export function saveFavourite(fav: Favourite): void {
  const existing = getFavourites()
  if (existing.some((f) => f.id === fav.id)) return
  write('favourites', [...existing, fav])
}

export function removeFavourite(id: string): void {
  write('favourites', getFavourites().filter((f) => f.id !== id))
}

export function isFavourite(id: string): boolean {
  return getFavourites().some((f) => f.id === id)
}

// Ratings
export function getRatings(): Ratings {
  return read<Ratings>('ratings', {})
}

export function setRating(recipeId: string, rating: number): void {
  write('ratings', { ...getRatings(), [recipeId]: rating })
}

export function getRating(recipeId: string): number | undefined {
  return getRatings()[recipeId]
}
