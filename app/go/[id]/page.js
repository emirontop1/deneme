'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SurveyGate() {
  const { id } = useParams()
  const [linkData, setLinkData] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedLinks = localStorage.getItem('survey_links')
    if (savedLinks) {
      const links = JSON.parse(savedLinks)
      const found = links.find(l => l.id === id)
      if (found) {
        setLinkData(found)
      }
    }
    setLoading(false)
  }, [id])

  const handleVote = (idx) => {
    if (surveyCompleted) return
    setSelectedOption(idx)
    setSurveyCompleted(true)

    // Tıklama sayısını lokalde güncelle (Lootlabs mantığı istatistik kaydı)
    const savedLinks = localStorage.getItem('survey_links')
    if (savedLinks) {
      const links = JSON.parse(savedLinks)
      const updated = links.map(l => {
        if (l.id === id) {
          return { ...l, clicks: l.clicks + 1 }
        }
        return l
      })
      localStorage.setItem('survey_links', JSON.stringify(updated))
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Yükleniyor...</div>
  }

  if (!linkData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-2">Link Bulunamadı</h1>
        <p className="text-slate-500">Bu link silinmiş veya süresi dolmuş olabilir.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-semibold border border-blue-500/20">
            Link Kilidi Koruması
          </span>
          <h2 className="text-lg font-bold text-white mt-4">
            Devam etmek için aşağıdaki anketi tamamlayın
          </h2>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 mb-6">
          <h3 className="font-medium text-slate-200 mb-4 text-center">
            {linkData.surveyQuestion}
          </h3>
          <div className="space-y-2">
            {linkData.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={surveyCompleted}
                onClick={() => handleVote(idx)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-sm font-medium flex justify-between items-center ${
                  selectedOption === idx
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === idx && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Seçildi</span>}
              </button>
            ))}
          </div>
        </div>

        {surveyCompleted ? (
          <a
            href={linkData.targetUrl}
            rel="noopener noreferrer"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all animate-bounce"
          >
            Hedefe Git (Kilidi Aç)
          </a>
        ) : (
          <button
            disabled
            className="w-full text-center bg-slate-700 text-slate-400 font-semibold py-3 rounded-xl cursor-not-allowed opacity-60"
          >
            Lütfen Anketi Cevaplayın
          </button>
        )}

        <p className="text-[10px] text-center text-slate-500 mt-4">
          Bu link LinkSurvey havuzu tarafından korunmaktadır.
        </p>
      </div>
    </div>
  )
}

