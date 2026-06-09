import RecipeCard from '@/components/ui/RecipeCard'
import type { Recipe } from '@/types/recipe'

type Props = { recipes: Recipe[] }

export default function RecipeList({ recipes }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16">
      <h2 className="mb-6 text-xl font-bold text-gray-800">המתכונים שמצאנו עבורכם</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, i) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={i} />
        ))}
      </div>
    </section>
  )
}
