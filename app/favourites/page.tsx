import FavouritesList from '@/components/features/FavouritesList'

export default function FavouritesPage() {
  return (
    <div className="min-h-screen">
      <section
        className="px-4 pb-20 pt-12 text-white"
        style={{ background: 'linear-gradient(160deg, #009DE0 0%, #006FAA 100%)' }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">המועדפים שלי</h1>
          <p className="mt-3 text-lg text-blue-100">המתכונים ששמרת לעצמך</p>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-4xl px-4 pb-16">
        <FavouritesList />
      </div>
    </div>
  )
}
