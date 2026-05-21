import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
        LinkSurvey Pro
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-lg">
        LootLabs tarzı link kısaltma ve anket tamamlama sistemine hoş geldiniz. Linklerinizi kilitleyin ve etkileşim kazanın.
      </p>
      <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all">
        Dashboard'a Git
      </Link>
    </div>
  )
}

