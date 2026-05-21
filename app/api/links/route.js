import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const LINKS_SET_KEY = 'links:ids';

export async function GET() {
  try {
    const ids = (await kv.smembers(LINKS_SET_KEY)) ?? [];
    if (!ids.length) {
      return NextResponse.json({ links: [], totalClicks: 0 });
    }

    const keys = ids.map((id) => `link:${id}`);
    const rawLinks = await kv.mget(...keys);
    const links = rawLinks.filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks ?? 0), 0);

    return NextResponse.json({ links, totalClicks });
  } catch (error) {
    return NextResponse.json({ error: 'Links alınamadı', detail: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { targetUrl, tasks, linkMode = 'normal', secretText = '' } = body;

    if (!targetUrl || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ error: 'targetUrl ve en az bir task zorunludur.' }, { status: 400 });
    }

    const id = Math.random().toString(36).slice(2, 8);
    const generatedKey =
      linkMode === 'key'
        ? `KEY-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36)
            .slice(2, 6)
            .toUpperCase()}`
        : null;

    const newLink = {
      id,
      targetUrl,
      tasks,
      linkMode,
      secretText,
      generatedKey,
      clicks: 0,
      createdAt: Date.now(),
    };

    await kv.set(`link:${id}`, newLink);
    await kv.sadd(LINKS_SET_KEY, id);

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Link oluşturulamadı', detail: error.message }, { status: 500 });
  }
}
