'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [targetUrl, setTargetUrl] = useState('')
  const [surveyQuestion, setSurveyQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
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

  const handleCreateLink = (e) => {
    e.preventDefault()
    if (!targetUrl || !surveyQuestion || options.some(o => !o)) {
      alert('Lütfen tüm alanları doldurun!')
      return
    }

    const newLink = {
      id: Math.random().toString(36).substring(2, 8),
      targetUrl,
      surveyQuestion,
      options,
      clicks: 0
    }

    const updatedLinks = [newLink, ...links]
    setLinks(updatedLinks)
    localStorage.setItem('survey_links', JSON.stringify(updatedLinks))

    // Reset form
    setTargetUrl('')
    setSurveyQuestion('')
    setOptions(['', ''])
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">LinkSurvey Dashboard</h1>
        <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-400">Vercel Ready</span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CREATE LINK FORM */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-slate-800 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-semibold mb-4 text-white">Yeni Anketli Link Oluştur</h2>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Hedef Link (Gidilecek Site)</label>
              <input 
                type="url" required placeholder="https://example.com/file"
                value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Anket Sorusu</label>
              <input 
                type="text" required placeholder="Hangi işletim sistemini kullanıyorsunuz?"
                value={surveyQuestion} onChange={(e) => setSurveyQuestion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Anket Şıkları</label>
              {options.map((opt, idx) => (
                <input 
                  key={idx} type="text" required placeholder={`Şık #${idx + 1}`}
                  value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mb-2 focus:outline-none focus:border-blue-500"
                />
              ))}
              <button 
                type="button" onClick={handleAddOption}
                className="text-xs text-blue-400 hover:underline mt-1 block"
              >
                + Şık Ekle
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors">
              Kilitli Link Oluştur
            </button>
          </form>
        </div>

        {/* LINKS LIST */}
        <div className="lg:col-span-2 space-y-4">
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

