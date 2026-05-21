'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [targetUrl, setTargetUrl] = useState('')
  const [surveyQuestion, setSurveyQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [linkMode, setLinkMode] = useState('normal') // 'normal' veya 'key'
  const [secretText, setSecretText] = useState('') 
  const [links, setLinks] = useState([])
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
    const savedLinks = localStorage.getItem('survey_links')
    if (savedLinks) setLinks(JSON.parse(savedLinks))
  }, [])

  const handleAddOption = () => setOptions([...options, ''])
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const part1 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    return `KEY-${part1}-${part2}`
  }

  const handleCreateLink = (e) => {
    e.preventDefault()
    if (!targetUrl || !surveyQuestion || options.some(o => !o)) {
      alert('Lütfen tüm alanları doldurun!')
      return
    }
    if (linkMode === 'key' && !secretText) {
      alert('Key modu için gizli yazıyı doldurmalısınız!')
      return
    }

    const newLink = {
      id: Math.random().toString(36).substring(2, 8),
      targetUrl,
      surveyQuestion,
      options,
      linkMode,
      secretText: linkMode === 'key' ? secretText : '',
      generatedKey: linkMode === 'key' ? generateRandomKey() : null,
      clicks: 0
    }

    const updatedLinks = [newLink, ...links]
    setLinks(updatedLinks)
    localStorage.setItem('survey_links', JSON.stringify(updatedLinks))

    setTargetUrl('')
    setSurveyQuestion('')
    setOptions(['', ''])
    setSecretText('')
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">LinkSurvey Premium</h1>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">v2.0 - Key System</span>
        </div>
        <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-400">Vercel Active</span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="lg:col-span-1 bg-slate-800/40 border border-slate-800 p-6 rounded-2xl h-fit shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">Gelişmiş Link Oluştur</h2>
          <form onSubmit={handleCreateLink} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Link Çalışma Modu</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setLinkMode('normal')}
                  className={`py-2 text-xs font-medium rounded-lg transition-all ${linkMode === 'normal' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Normal (Direkt)
                </button>
                <button
                  type="button"
                  onClick={() => setLinkMode('key')}
                  className={`py-2 text-xs font-medium rounded-lg transition-all ${linkMode === 'key' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Key Sistemi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Hedef Link</label>
              <input 
                type="url" required placeholder="https://example.com/file"
                value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {linkMode === 'key' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-indigo-400 mb-1">Gizli Yazı / Script / Şifre</label>
                <textarea 
                  required placeholder="Ziyaretçi key alınca göreceği gizli yazı..."
                  value={secretText} onChange={(e) => setSecretText(e.target.value)}
                  rows="2"
                  className="w-full bg-slate-900 border border-indigo-900/60 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Anket Sorusu</label>
              <input 
                type="text" required placeholder="Devam etmek için birini seçin"
                value={surveyQuestion} onChange={(e) => setSurveyQuestion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Anket Şıkları</label>
              {options.map((opt, idx) => (
                <input 
                  key={idx} type="text" required placeholder={`Şık #${idx + 1}`}
                  value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white mb-2 focus:outline-none focus:border-blue-500"
                />
              ))}
              <button 
                type="button" onClick={handleAddOption}
                className="text-xs text-blue-400 hover:underline mt-1 block"
              >
                + Yeni Şık Ekle
              </button>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg">
              Kilitli Link Oluştur
            </button>
          </form>
        </div>

        {/* LİSTELEME EKRANI */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Oluşturulan Link Havuzunuz</h2>
          {links.length === 0 ? (
            <p className="text-slate-500 bg-slate-800/10 p-12 rounded-2xl text-center border border-dashed border-slate-800">Henüz aktif bir kilitli linkiniz bulunmuyor.</p>
          ) : (
            links.map((link) => (
              <div key={link.id} className="bg-slate-800/20 border border-slate-800/80 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${link.linkMode === 'key' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {link.linkMode === 'key' ? '🔑 Key Modu' : '🔗 Normal'}
                    </span>
                    <div className="text-sm font-semibold text-emerald-400 truncate select-all">
                      {baseUrl}/go/{link.id}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 truncate">Hedef: {link.targetUrl}</p>
                  {link.linkMode === 'key' && (
                    <p className="text-xs text-indigo-300 truncate bg-indigo-950/40 px-2 py-1 rounded border border-indigo-900/30">Gizli İçerik: {link.secretText}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 self-end md:self-auto">
                  <div className="text-center">
                    <span className="block text-xl font-bold text-white font-mono">{link.clicks}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Tıklama</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Hedef Link</label>
              <input 
                type="url" required placeholder="https://example.com/file"
                value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {linkMode === 'key' && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-semibold uppercase text-indigo-400 mb-1">Gizli Yazı / Script / Şifre</label>
                <textarea 
                  required placeholder="Ziyaretçi anket çözüp key alınca göreceği gizli yazı veya dosya şifresi..."
                  value={secretText} onChange={(e) => setSecretText(e.target.value)}
                  rows="2"
                  className="w-full bg-slate-900 border border-indigo-900/60 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Anket Sorusu</label>
              <input 
                type="text" required placeholder="İçeriğe erişmek için birini seçin"
                value={surveyQuestion} onChange={(e) => setSurveyQuestion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Anket Şıkları</label>
              {options.map((opt, idx) => (
                <input 
                  key={idx} type="text" required placeholder={`Şık #${idx + 1}`}
                  value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white mb-2 focus:outline-none focus:border-blue-500"
                />
              ))}
              <button 
                type="button" onClick={handleAddOption}
                className="text-xs text-blue-400 hover:underline mt-1 block"
              >
                + Yeni Şık Ekle
              </button>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg">
              Kilitli Link Oluştur
            </button>
          </form>
        </div>

        {/* LİSTELEME EKRANI */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Oluşturulan Link Havuzunuz</h2>
          {links.length === 0 ? (
            <p className="text-slate-500 bg-slate-800/10 p-12 rounded-2xl text-center border border-dashed border-slate-800">Henüz aktif bir kilitli linkiniz bulunmuyor.</p>
          ) : (
            links.map((link) => (
              <div key={link.id} className="bg-slate-800/20 border border-slate-800/80 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${link.linkMode === 'key' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {link.linkMode === 'key' ? '🔑 Key Modu' : '🔗 Normal'}
                    </span>
                    <div className="text-sm font-semibold text-emerald-400 truncate select-all">
                      {baseUrl}/go/{link.id}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 truncate">Hedef: {link.targetUrl}</p>
                  {link.linkMode === 'key' && (
                    <p className="text-xs text-indigo-300 truncate bg-indigo-950/40 px-2 py-1 rounded border border-indigo-900/30">Gizli İçerik: {link.secretText}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 self-end md:self-auto">
                  <div className="text-center">
                    <span className="block text-xl font-bold text-white font-mono">{link.clicks}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Tıklama</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
          <h2 className="text-xl font-semibold text-white mb-4">Oluşturulan Linkler</h2>
          {links.length === 0 ? (
            <p className="text-slate-500 bg-slate-800/20 p-8 rounded-2xl text-center border border-dashed border-slate-800">Henüz hiç link oluşturulmadı.</p>
          ) : (
            links.map((link) => (
              <div key={link.id} className="bg-slate-800/30 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-emerald-400 break-all select-all">
                    {baseUrl}/go/{link.id}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-md">
                    Hedef: {link.targetUrl}
                  </div>
                  <div className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 inline-block">
                    Soru: {link.surveyQuestion}
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <div className="text-center bg-slate-900 px-4 py-2 rounded-lg">
                    <span className="block text-lg font-bold text-white">{link.clicks}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Tıklama</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

