import { kv } from '@vercel/kv';

export const LINKS_SET_KEY = 'links:ids';

export function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error('En az 1 görev gerekli.');
  }

  return tasks.map((task, index) => {
    if (!task || typeof task !== 'object' || typeof task.type !== 'string') {
      throw new Error(`Görev #${index + 1} geçersiz.`);
    }

    if (task.type === 'survey') {
      const question = String(task.question ?? '').trim();
      const options = Array.isArray(task.options)
        ? task.options.map((option) => String(option ?? '').trim()).filter(Boolean)
        : [];

      if (!question || options.length < 2) {
        throw new Error(`Survey #${index + 1} için soru ve en az 2 şık gerekli.`);
      }

      return { type: 'survey', question, options: options.slice(0, 6) };
    }

    if (task.type === 'ad') {
      const duration = Number(task.duration);
      if (!Number.isInteger(duration) || duration < 3 || duration > 120) {
        throw new Error(`Ad Timer #${index + 1} süresi 3-120 saniye olmalı.`);
      }

      return { type: 'ad', duration };
    }

    throw new Error(`Görev #${index + 1} tipi desteklenmiyor: ${task.type}`);
  });
}

export async function generateUniqueId(maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const id = Math.random().toString(36).slice(2, 8);
    const exists = await kv.exists(`link:${id}`);
    if (!exists) {
      return id;
    }
  }

  throw new Error('Benzersiz link id üretilemedi, tekrar deneyin.');
}

export function generateRewardKey() {
  return `KEY-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}
