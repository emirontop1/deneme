'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function UniversalGate() {
  const { id } = useParams()
  const [linkData, setLinkData] = useState(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [adTimer, setAdTimer] = useState(0)
  const [adCounting, setAdCounting] = useState(false)
  const [keyCopied, setKeyCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinkDetails()
  }, [id])

  const fetchLinkDetails = async () => {
    try {
      const res = await fetch(`/app/../api/links/${id}`)
      if (res.ok) {
        const data = await res.json()
        setLinkData(data)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  // Reklam Sayacını Yöneten Mekanizma
  useEffect(() => {
    let interval;
    if (adCounting && adTimer > 0) {
      interval = setInterval(() => setAdTimer(t => t - 1), 1000)
    } else if (adCounting && adTimer === 0) {
      setAdCounting(false)
      handleTaskComplete()
    }
    return () => clearInterval(interval)
  }, [adCounting, adTimer])

  const startAdTimer = (duration) => {
    setAdTimer(duration)
    setAdCounting(true)
  }

  const handleTaskComplete = async () => {
    const nextIndex = currentTaskIndex + 1
    if (linkData.tasks && nextIndex >= linkData.tasks.length) {
      // Tüm görevler bittiğinde veritabanında tıklamayı global artır
      await fetch(`/app/../api/links/${id}`, { method: 'POST' })
      setCurrentTaskIndex(nextIndex) // Kilit açılma aşamasına geçir
    } else {
      setCurrentTaskIndex(nextIndex)
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-400 bg-slate-950 font-mono">Veritabanı Bağlantısı Kuruluyor...</div>
  if (!linkData) return <div className="flex min-h-screen items-center justify-center text-rose-500 bg-slate-950 font-bold">404 - Kilitli Havuz Bulunamadı</div>

  const activeTask = linkData.tasks ? linkData.tasks[currentTaskIndex] : null
  const allTasksFinished = linkData.tasks ? currentTaskIndex >= linkData.tasks.length : false

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6">
        
        {/* Üst Kısım İlerleme Çubuğu */}
        <div className="text-center space-y-2">
          <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-blue-500/20">
            {allTasksFinished ? "🔓 Kilit Açıldı" : `🔒 Görevleri Tamamla (${currentTaskIndex + 1}/${linkData.tasks?.length})`}
          </div>
          <p className="text-xs text-slate-400">İçeriğe güvenli bir şekilde yönlendirilmek üzere doğrulamaları geçin.</p>
        </div>

        {/* AKTİF GÖREV EKRANI */}
        {!allTasksFinished && activeTask && (
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
            {activeTask.type === 'survey' ? (
              <div className="space-y-4">
                <h3 className="text-center text-sm font-semibold text-slate-200">{activeTask.question}</h3>
                <div className="space-y-2">
                  {activeTask.options?.map((opt, idx) => (
                    <button key={idx} onClick={handleTaskComplete} className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium hover:border-blue-500 transition-colors">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <h3 className="text-sm font-semibold text-slate-200">Sponsorlu Reklam Adımı</h3>
                {adCounting ? (
                  <div className="text-4xl font-black text-amber-400 font-mono">{adTimer}<span className="text-xs text-slate-500 ml-1">sn</span></div>
                ) : (
                  <button onClick={() => startAdTimer(activeTask.duration)} className="bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold px-6 py-3 rounded-xl shadow-lg transition-colors">
                    ▶ Reklamı Başlat ve Bekle
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TÜM ADIMLAR BİTTİĞİNDE SİSTEM SONU */}
        {allTasksFinished && (
          <div className="space-y-4 animate-fadeIn">
            {linkData.linkMode === 'key' ? (
              <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-2xl space-y-3">
                <div className="text-center text-xs font-bold text-indigo-400">Sistem Anahtarı Doğrulandı:</div>
                <div className="flex gap-2">
                  <div className="bg-slate-950 border border-slate-800 p-2 text-center rounded-xl font-mono text-sm font-bold flex-1 select-all text-indigo-300">{linkData.generatedKey}</div>
                  <button onClick={() => { navigator.clipboard.writeText(linkData.generatedKey); setKeyCopied(true) }} className="bg-indigo-600 text-white px-3 rounded-xl text-xs font-bold">Kopyala</button>
                </div>
                {keyCopied && (
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 mt-2">
                    <span className="block text-emerald-400 font-bold mb-1">🎁 Gizli Ödül Verisi:</span>
                    <p className="font-mono bg-slate-900 p-2 rounded border border-slate-800 break-all">{linkData.secretText}</p>
                  </div>
                )}
              </div>
            ) : (
              <a href={linkData.targetUrl} className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-xl transition-all">
                Hedefe Güvenli Git 🚀
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
