import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const rubik = Rubik({ subsets: ['hebrew', 'latin'] })

export const metadata: Metadata = {
  title: 'מה לבשל היום?',
  description: 'הצע מתכונים לפי מצרכים שיש לך בבית',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={rubik.className}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link
              href="/favourites"
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-[#009DE0] hover:text-[#009DE0]"
            >
              המועדפים שלי
            </Link>
            <Link href="/" className="text-2xl font-bold text-[#009DE0]">
              מנץ׳
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
