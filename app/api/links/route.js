import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { generateRewardKey, generateUniqueId, isValidHttpUrl, LINKS_SET_KEY, sanitizeTasks } from '../../../lib/link-store';

export async function GET() {
  try {
    const ids = (await kv.smembers(LINKS_SET_KEY)) ?? [];
    if (!ids.length) {
      return NextResponse.json({ links: [], totalClicks: 0 });
    }

    const links = (await kv.mget(...ids.map((id) => `link:${id}`))).filter(Boolean);
    const sortedLinks = links.sort((a, b) => b.createdAt - a.createdAt);
    const totalClicks = sortedLinks.reduce((acc, link) => acc + Number(link.clicks ?? 0), 0);

    return NextResponse.json({ links: sortedLinks, totalClicks });
  } catch (error) {
    return NextResponse.json({ error: 'Link listesi alınamadı.', detail: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const targetUrl = String(body.targetUrl ?? '').trim();
    const linkMode = body.linkMode === 'key' ? 'key' : 'normal';
    const secretText = String(body.secretText ?? '').trim();

    if (!isValidHttpUrl(targetUrl)) {
      return NextResponse.json({ error: 'Geçerli bir hedef URL girin (http/https).' }, { status: 400 });
    }

    if (linkMode === 'key' && !secretText) {
      return NextResponse.json({ error: 'Key modunda gizli metin zorunludur.' }, { status: 400 });
    }

    const tasks = sanitizeTasks(body.tasks);
    const id = await generateUniqueId();

    const payload = {
      id,
      targetUrl,
      tasks,
      linkMode,
      secretText: linkMode === 'key' ? secretText : '',
      generatedKey: linkMode === 'key' ? generateRewardKey() : null,
      clicks: 0,
      createdAt: Date.now(),
    };

    await kv.set(`link:${id}`, payload);
    await kv.sadd(LINKS_SET_KEY, id);

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Link oluşturulamadı.', detail: error.message }, { status: 500 });
  }
}
