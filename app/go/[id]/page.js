'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SurveyGate() {
  const { id } = useParams()
  const [linkData, setLinkData] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [keyCopied, setKeyCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedLinks = localStorage.getItem('survey_links')
    if (savedLinks) {
      const links = JSON.parse(savedLinks)
      const found = links.find(l => l.id === id)
      if (found) setLinkData(found)
    }
    setLoading(false)
  }, [id])

  const handleVote = (idx) => {
    if (surveyCompleted) return
    setSelectedOption(idx)
    setSurveyCompleted(true)

    // İstatistik artırma simülasyonu
    const savedLinks = localStorage.getItem('survey_links')
    if (savedLinks) {
      const links = JSON.parse(savedLinks)
      const updated = links.map(l => l.id === id ? { ...l, clicks: l.clicks + 1 } : l)
      localStorage.setItem('survey_links', JSON.stringify(updated))
    }
  }

  const handleCopyKey = () => {
    if (!linkData?.generatedKey) return
    navigator.clipboard.writeText(linkData.generatedKey)
    setKeyCopied(true)
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-400 bg-slate-950">Sistem Hazırlanıyor...</div>

  if (!linkData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-slate-950">
        <h1 className="text-2xl font-bold text-rose-500 mb-2">404 - Geçersiz Kilit</h1>
        <p className="text-slate-500">Aradığınız link havuzdan silinmiş veya süresi dolmuş.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Üst Logo/Bilgilendirme */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {linkData.linkMode === 'key' ? '🔑 Key Koruma Sistemi' : '🛡️ Güvenli Geçiş Havuzu'}
          </div>
          <h2 className="text-md font-semibold text-slate-300 mt-4">
            İçeriğe erişmek için doğrulamayı tamamlayın
          </h2>
        </div>

        {/* ANKET ALANI */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
          <h3 className="text-sm font-medium text-slate-200 mb-3 text-center bg-slate-900 py-2 rounded-lg border border-slate-800">
            {linkData.surveyQuestion}
          </h3>
          <div className="space-y-2">
            {linkData.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={surveyCompleted}
                onClick={() => handleVote(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all flex justify-between items-center ${
                  selectedOption === idx
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 disabled:opacity-50'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === idx && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">ONAYLANDI</span>}
              </button>
            ))}
          </div>
        </div>

        {/* KİLİT AÇILMA SONRASI EKRAN MANTIĞI */}
        {surveyCompleted ? (
          <div className="space-y-4 animate-fadeIn">
            {linkData.linkMode === 'key' ? (
              // KEY MODU SEÇİLDİYSE GÖSTERİLECEK EKRAN
              <div className="space-y-3 bg-indigo-950/30 p-4 rounded-xl border border-indigo-900/50">
                <div className="text-center text-xs font-semibold text-indigo-400">Anahtarınız Üretildi:</div>
                <div className="flex gap-2">
                  <div className="bg-slate-950 border border-indigo-900 px-3 py-2 rounded-lg font-mono text-sm text-center font-bold text-indigo-300 flex-1 tracking-wider">
                    {linkData.generatedKey}
                  </div>
                  <button 
                    onClick={handleCopyKey}
                    className={`px-4 text-xs font-bold rounded-lg transition-all ${keyCopied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                  >
                    {keyCopied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>

                {keyCopied && (
                  <div className="mt-4 p-3 bg-slate-950 border border-emerald-900/50 rounded-lg text-xs text-emerald-400 animate-slideUp">
                    <span className="block font-bold text-white mb-1">🔓 Gizli Mesaj Açıldı:</span>
                    <p className="break-all font-mono bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">{linkData.secretText}</p>
                    <a 
                      href={linkData.targetUrl} target="_blank" rel="noopener noreferrer"
                      className="block text-center mt-3 text-blue-400 underline hover:text-blue-300"
                    >
                      Ana Kaynağa Git (İsteğe Bağlı)
                    </a>
                  </div>
                )}
              </div>
            ) : (
              // NORMAL MOD SEÇİLDİYSE DIREKT HEDEFE YÖNLENDİRME BUTONU
              <a
                href={linkData.targetUrl}
                className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
              >
                Sisteme Giriş Yap (Hedefe Git)
              </a>
            )}
          </div>
        ) : (
          // ANKET ÇÖZÜLMEDİYSE BUTON KİLİTLİDİR
          <button
            disabled
            className="w-full text-center bg-slate-800 text-slate-500 font-bold py-3 rounded-xl cursor-not-allowed text-sm"
          >
            🔒 Devam Etmek İçin Anketi Tamamlayın
          </button>
        )}

        <div className="text-center mt-4 text-[9px] text-slate-600 tracking-wider">
          SECURE BY LINKSURVEY ARCHITECTURE
        </div>
      </div>
    </div>
  )
}
