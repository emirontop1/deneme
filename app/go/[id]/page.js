'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

export default function GoPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      const res = await fetch(`/api/links/${id}`, { cache: 'no-store' });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error ?? 'Link alınamadı.');
        return;
      }

      setData(payload);
    }

    if (id) void load();
  }, [id]);

  useEffect(() => {
    if (!running || timer <= 0) return;
    const timeout = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(timeout);
  }, [running, timer]);

  useEffect(() => {
    if (!running || timer !== 0) return;
    setRunning(false);
    void completeTask();
  }, [running, timer]);

  const done = useMemo(() => step >= (data?.tasks?.length ?? 0), [data?.tasks?.length, step]);

  async function completeTask() {
    if (!data) return;

    const nextStep = step + 1;
    if (nextStep >= data.tasks.length) {
      await fetch(`/api/links/${id}`, { method: 'POST' });
    }

    setStep(nextStep);
  }

  if (error) {
    return <main className="grid min-h-screen place-items-center p-6 text-rose-400">{error}</main>;
  }

  if (!data) {
    return <main className="grid min-h-screen place-items-center p-6 text-slate-300">Yükleniyor...</main>;
  }

  const activeTask = data.tasks[step];

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-xs text-slate-400">Adım {Math.min(step + 1, data.tasks.length)} / {data.tasks.length}</p>

        {!done && activeTask?.type === 'survey' && (
          <div className="space-y-3">
            <h2 className="font-semibold">{activeTask.question}</h2>
            {activeTask.options.map((option) => (
              <button key={option} onClick={() => void completeTask()} className="block w-full rounded bg-slate-800 p-2 text-left">{option}</button>
            ))}
          </div>
        )}

        {!done && activeTask?.type === 'ad' && (
          <div className="space-y-3 text-center">
            <h2 className="font-semibold">Ad Timer</h2>
            {running ? (
              <p className="text-3xl font-bold">{timer}</p>
            ) : (
              <button onClick={() => { setTimer(activeTask.duration); setRunning(true); }} className="rounded bg-amber-500 px-3 py-2 font-semibold text-slate-950">Başlat</button>
            )}
          </div>
        )}

        {done && (
          <div className="space-y-3">
            {data.linkMode === 'key' ? (
              <>
                <div className="rounded bg-slate-800 p-2 text-center text-xs text-slate-300">Key başarıyla üretildi</div>
                <div className="rounded bg-slate-800 p-2 font-mono">{data.generatedKey}</div>
                <div className="rounded bg-slate-800 p-2">{data.secretText}</div>
              </>
            ) : (
              <a href={data.targetUrl} rel="noreferrer" className="block rounded bg-emerald-600 p-2 text-center font-semibold">Hedefe Git</a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
