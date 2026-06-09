export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#009DE0]/20 border-t-[#009DE0]" />
      <p className="text-sm text-gray-500">מחפשים מתכונים עבורכם...</p>
    </div>
  )
}
