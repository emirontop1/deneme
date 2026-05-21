'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [targetUrl, setTargetUrl] = useState('')
  const [linkMode, setLinkMode] = useState('normal') 
  const [secretText, setSecretText] = useState('') 
  const [tasks, setTasks] = useState([]) // Çoklu görev havuzu
  const [links, setLinks] = useState([])
  const [baseUrl, setBaseUrl] = useState('')

  // Geçici Görev Form Elemanları
  const [taskType, setTaskType] = useState('survey') // 'survey' veya 'ad'
  const [surveyQuestion, setSurveyQuestion] = useState('')
  const [surveyOptions, setSurveyOptions] = useState(['', ''])
  const [adDuration, setAdDuration] = useState(10)

  useEffect(() => {
    setBaseUrl(window.location.origin)
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const res = await fetch('/api/links')
    const data = await res.json()
    if (Array.isArray(data)) setLinks(data)
  }

  const handleAddTask = () => {
    if (taskType === 'survey') {
      if (!surveyQuestion || surveyOptions.some(o => !o)) return alert('Anket alanlarını doldurun!')
      setTasks([...tasks, { type: 'survey', question: surveyQuestion, options: surveyOptions }])
      setSurveyQuestion(''); setSurveyOptions(['', ''])
    } else {
      setTasks([...tasks, { type: 'ad', duration: Number(adDuration) }])
    }
  }

  const handleCreateLink = async (e) => {
    e.preventDefault()
    if (!targetUrl || tasks.length === 0) return alert('Lütfen hedef linki girin ve en az 1 Görev ekleyin!')
    
    const id = Math.random().toString(36).substring(2, 8)
    const generatedKey = linkMode === 'key' ? `KEY-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}` : null

    const payload = { id, targetUrl, tasks, linkMode, secretText, generatedKey }

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setTargetUrl(''); setTasks([]); setSecretText(''); fetchLinks()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">LinkSurvey Cloud Studio</h1>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">Global Cloud Sync</span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL PANEL - AYARLAR */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 h-fit">
          <h2 className="text-lg font-bold text-white">1. Genel Ayarlar</h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Çalışma Modu</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button type="button" onClick={() => setLinkMode('normal')} className={`py-2 text-xs font-medium rounded-lg ${linkMode === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Normal</button>
              <button type="button" onClick={() => setLinkMode('key')} className={`py-2 text-xs font-medium rounded-lg ${linkMode === 'key' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Key Sistemi</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Hedef URL</label>
            <input type="url" required placeholder="https://..." value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"/>
          </div>

          {linkMode === 'key' && (
            <div>
              <label className="block text-xs font-semibold text-indigo-400 mb-1">Gizli Metin / Ödül İçeriği</label>
              <textarea required placeholder="Şifre veya gizli yazı..." value={secretText} onChange={(e) => setSecretText(e.target.value)} rows="2" className="w-full bg-slate-950 border border-indigo-900/40 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"/>
            </div>
          )}
        </div>

        {/* ORTA PANEL - ADIM / GÖREV EKLEME */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 h-fit">
          <h2 className="text-lg font-bold text-white">2. Görev Havuzu Ekle ({tasks.length} Görev Var)</h2>
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => setTaskType('survey')} className={`flex-1 py-1.5 text-xs rounded border ${taskType === 'survey' ? 'bg-slate-800 border-slate-700 text-white' : 'border-transparent text-slate-500'}`}>Anket Görevi</button>
              <button type="button" onClick={() => setTaskType('ad')} className={`flex-1 py-1.5 text-xs rounded border ${taskType === 'ad' ? 'bg-slate-800 border-slate-700 text-white' : 'border-transparent text-slate-500'}`}>Reklam Bekleme</button>
            </div>

            {taskType === 'survey' ? (
              <div className="space-y-3">
                <input type="text" placeholder="Anket Sorusu?" value={surveyQuestion} onChange={(e) => setSurveyQuestion(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"/>
                <input type="text" placeholder="Şık 1" value={surveyOptions[0]} onChange={(e) => setSurveyOptions([e.target.value, surveyOptions[1]])} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"/>
                <input type="text" placeholder="Şık 2" value={surveyOptions[1]} onChange={(e) => setSurveyOptions([surveyOptions[0], e.target.value])} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"/>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Bekleme Süresi (Saniye)</label>
                <input type="number" min="5" max="60" value={adDuration} onChange={(e) => setAdDuration(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"/>
              </div>
            )}

            <button type="button" onClick={handleAddTask} className="w-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium py-2 rounded-lg mt-4 transition-colors">
              + Bu Görevi Seriye Ekle
            </button>
          </div>

          {/* Eklenen adımların sıralı listesi */}
          <div className="space-y-2">
            {tasks.map((t, i) => (
              <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold font-mono">Adım #{i+1}</span>
                <span className="text-slate-300">{t.type === 'survey' ? `📝 Anket: ${t.question}` : `⏳ Reklam: ${t.duration}sn`}</span>
              </div>
            ))}
          </div>

          <button onClick={handleCreateLink} className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg">
            Sistemi Kilitle ve Link Üret
          </button>
        </div>

        {/* SAĞ PANEL - GLOBAL LİSTE */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white">3. Global Aktif Linkleriniz</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {links.map((link) => (
              <div key={link.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-xs font-mono text-emerald-400 select-all break-all bg-slate-900 p-2 rounded border border-slate-800">{baseUrl}/go/{link.id}</div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>🛠️ {link.tasks?.length || 0} Görev Adımı</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-white font-bold">{link.clicks || 0} Global Tık</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
