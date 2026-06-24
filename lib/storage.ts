import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'
import type { Favourite, Ratings } from '@/types/recipe'

const isBrowser = typeof window !== 'undefined'

function logError(label: string, error: PostgrestError) {
  console.error(`${label}: [${error.code}] ${error.message}`, error.details ?? '')
}

function localRead<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function localWrite<T>(key: string, value: T): void {
  if (!isBrowser) return
  localStorage.setItem(key, JSON.stringify(value))
}

// Favourites

export async function getFavourites(userId?: string | null): Promise<Favourite[]> {
  if (userId) {
    const { data, error } = await supabase
      .from('favourites')
      .select('recipe_data')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) { logError('getFavourites', error); return [] }
    return data.map((row) => row.recipe_data as Favourite)
  }
  return localRead<Favourite[]>('favourites', [])
}

export async function saveFavourite(fav: Favourite, userId?: string | null): Promise<void> {
  if (userId) {
    const { data: existing } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', fav.id)
      .maybeSingle()
    if (existing) return
    const { error } = await supabase.from('favourites').insert({
      user_id: userId,
      recipe_id: fav.id,
      recipe_data: fav,
    })
    if (error) logError('saveFavourite', error)
    return
  }
  const existing = localRead<Favourite[]>('favourites', [])
  if (existing.some((f) => f.id === fav.id)) return
  localWrite('favourites', [...existing, fav])
}

export async function removeFavourite(id: string, userId?: string | null): Promise<void> {
  if (userId) {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', id)
    if (error) logError('removeFavourite', error)
    return
  }
  localWrite('favourites', localRead<Favourite[]>('favourites', []).filter((f) => f.id !== id))
}

export async function isFavourite(id: string, userId?: string | null): Promise<boolean> {
  if (userId) {
    const { data, error } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', id)
      .maybeSingle()
    if (error) logError('isFavourite', error)
    return !!data
  }
  return localRead<Favourite[]>('favourites', []).some((f) => f.id === id)
}

// Ratings

export async function getRatings(userId?: string | null): Promise<Ratings> {
  if (userId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('recipe_id, rating')
      .eq('user_id', userId)
    if (error) { logError('getRatings', error); return {} }
    return Object.fromEntries(data.map((r) => [r.recipe_id, r.rating]))
  }
  return localRead<Ratings>('ratings', {})
}

export async function setRating(recipeId: string, rating: number, userId?: string | null): Promise<void> {
  if (userId) {
    const { error } = await supabase.from('ratings').upsert(
      { user_id: userId, recipe_id: recipeId, rating },
      { onConflict: 'user_id,recipe_id' },
    )
    if (error) logError('setRating', error)
    return
  }
  localWrite('ratings', { ...localRead<Ratings>('ratings', {}), [recipeId]: rating })
}

export async function getRating(recipeId: string, userId?: string | null): Promise<number | undefined> {
  if (userId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle()
    if (error) logError('getRating', error)
    return data?.rating ?? undefined
  }
  return localRead<Ratings>('ratings', {})[recipeId]
}
