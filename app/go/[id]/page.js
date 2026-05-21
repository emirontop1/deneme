'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function GoPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/links/${id}`);
      if (res.ok) setData(await res.json());
    }
    if (id) void load();
  }, [id]);

  useEffect(() => {
    if (!running || timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timer]);

  useEffect(() => {
    if (running && timer === 0) {
      setRunning(false);
      completeTask();
    }
  }, [running, timer]);

  async function completeTask() {
    const next = step + 1;
    if (next >= (data?.tasks?.length ?? 0)) {
      await fetch(`/api/links/${id}`, { method: 'POST' });
    }
    setStep(next);
  }

  if (!data) return <main className="grid min-h-screen place-items-center">Yükleniyor...</main>;

  const done = step >= data.tasks.length;
  const active = data.tasks[step];

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5">
        {!done && active?.type === 'survey' && (
          <div className="space-y-3">
            <h2 className="font-semibold">{active.question}</h2>
            {active.options.map((option) => (
              <button key={option} onClick={completeTask} className="block w-full rounded bg-slate-800 p-2 text-left">{option}</button>
            ))}
          </div>
        )}

        {!done && active?.type === 'ad' && (
          <div className="space-y-3 text-center">
            <h2 className="font-semibold">Ad Timer</h2>
            {running ? <p className="text-3xl font-bold">{timer}</p> : <button onClick={() => { setTimer(active.duration); setRunning(true); }} className="rounded bg-amber-500 px-3 py-2 text-slate-950">Başlat</button>}
          </div>
        )}

        {done && (
          <div className="space-y-3">
            {data.linkMode === 'key' ? (
              <>
                <div className="rounded bg-slate-800 p-2 font-mono">{data.generatedKey}</div>
                <div className="rounded bg-slate-800 p-2">{data.secretText}</div>
              </>
            ) : (
              <a href={data.targetUrl} className="block rounded bg-emerald-600 p-2 text-center font-semibold">Hedefe Git</a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
