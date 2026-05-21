'use client';

import { useEffect, useState } from 'react';

const initialSurvey = { question: '', optionA: '', optionB: '' };

export default function DashboardPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [linkMode, setLinkMode] = useState('normal');
  const [secretText, setSecretText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskType, setTaskType] = useState('survey');
  const [survey, setSurvey] = useState(initialSurvey);
  const [adDuration, setAdDuration] = useState(10);
  const [links, setLinks] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    void fetchLinks();
  }, []);

  async function fetchLinks() {
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(data.links ?? []);
    setTotalClicks(data.totalClicks ?? 0);
  }

  function addTask() {
    if (taskType === 'survey') {
      if (!survey.question || !survey.optionA || !survey.optionB) return;
      setTasks((prev) => [...prev, { type: 'survey', question: survey.question, options: [survey.optionA, survey.optionB] }]);
      setSurvey(initialSurvey);
      return;
    }

    setTasks((prev) => [...prev, { type: 'ad', duration: Number(adDuration) }]);
  }

  async function createLink(e) {
    e.preventDefault();

    if (!targetUrl || !tasks.length) return;

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, tasks, linkMode, secretText }),
    });

    if (!res.ok) return;

    setTargetUrl('');
    setTasks([]);
    setSecretText('');
    await fetchLinks();
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Link Gateway Dashboard</h1>
      <p className="mb-8 text-slate-400">Global total clicks: {totalClicks}</p>
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={createLink} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4 lg:col-span-2">
          <input className="w-full rounded bg-slate-950 p-2" placeholder="https://target.com" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" className={`rounded px-3 py-2 ${linkMode === 'normal' ? 'bg-blue-600' : 'bg-slate-800'}`} onClick={() => setLinkMode('normal')}>Normal</button>
            <button type="button" className={`rounded px-3 py-2 ${linkMode === 'key' ? 'bg-indigo-600' : 'bg-slate-800'}`} onClick={() => setLinkMode('key')}>Key Modu</button>
          </div>
          {linkMode === 'key' && <textarea className="w-full rounded bg-slate-950 p-2" placeholder="Gizli metin" value={secretText} onChange={(e) => setSecretText(e.target.value)} />}

          <div className="rounded border border-slate-800 p-3">
            <div className="mb-3 flex gap-2">
              <button type="button" onClick={() => setTaskType('survey')} className={`rounded px-3 py-1 ${taskType === 'survey' ? 'bg-slate-700' : 'bg-slate-800'}`}>Survey</button>
              <button type="button" onClick={() => setTaskType('ad')} className={`rounded px-3 py-1 ${taskType === 'ad' ? 'bg-slate-700' : 'bg-slate-800'}`}>Ad Timer</button>
            </div>
            {taskType === 'survey' ? (
              <div className="space-y-2">
                <input className="w-full rounded bg-slate-950 p-2" placeholder="Soru" value={survey.question} onChange={(e) => setSurvey((s) => ({ ...s, question: e.target.value }))} />
                <input className="w-full rounded bg-slate-950 p-2" placeholder="Şık A" value={survey.optionA} onChange={(e) => setSurvey((s) => ({ ...s, optionA: e.target.value }))} />
                <input className="w-full rounded bg-slate-950 p-2" placeholder="Şık B" value={survey.optionB} onChange={(e) => setSurvey((s) => ({ ...s, optionB: e.target.value }))} />
              </div>
            ) : (
              <input type="number" min={3} className="w-full rounded bg-slate-950 p-2" value={adDuration} onChange={(e) => setAdDuration(e.target.value)} />
            )}
            <button type="button" onClick={addTask} className="mt-3 rounded bg-emerald-600 px-3 py-2">Görev Ekle</button>
          </div>

          <ul className="space-y-2 text-sm">
            {tasks.map((task, i) => <li key={`${task.type}-${i}`} className="rounded bg-slate-950 p-2">#{i + 1} {task.type === 'survey' ? task.question : `${task.duration}s ad`}</li>)}
          </ul>

          <button type="submit" className="rounded bg-blue-600 px-4 py-2 font-semibold">Link Oluştur</button>
        </form>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-4 font-semibold">Linkler</h2>
          <ul className="space-y-3 text-sm">
            {links.map((link) => (
              <li key={link.id} className="rounded bg-slate-950 p-3">
                <div>/go/{link.id}</div>
                <div className="text-slate-400">{link.tasks?.length ?? 0} görev • {link.clicks ?? 0} tık</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
