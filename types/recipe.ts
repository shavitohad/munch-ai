export type Cuisine =
  | 'הכל'
  | 'איטלקית'
  | 'אסייתית'
  | 'ים תיכונית'
  | 'מזרח תיכונית'
  | 'אמריקאית'
  | 'הודית'
  | 'מקסיקנית'
  | 'צרפתית'

export const CUISINES: Cuisine[] = [
  'הכל',
  'איטלקית',
  'אסייתית',
  'ים תיכונית',
  'מזרח תיכונית',
  'אמריקאית',
  'הודית',
  'מקסיקנית',
  'צרפתית',
]

export type Recipe = {
  id: string
  name: string
  description: string
  cuisine: string
  ingredients: string[]
  missingIngredients: string[]
  steps: string[]
  prepTime: string
  difficulty: string
}

export type Favourite = {
  id: string
  name: string
  description: string
  cuisine: string
  ingredients: string[]
  steps: string[]
  prepTime: string
  difficulty: string
  savedAt: string
}

export type Ratings = {
  [recipeId: string]: number
}
