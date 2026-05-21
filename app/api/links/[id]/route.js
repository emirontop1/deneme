import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  try {
    const link = await kv.get(`link:${params.id}`);
    if (!link) {
      return NextResponse.json({ error: 'Link bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Link detayları alınamadı.', detail: error.message }, { status: 500 });
  }
}

export async function POST(_request, { params }) {
  try {
    const key = `link:${params.id}`;
    const link = await kv.get(key);

    if (!link) {
      return NextResponse.json({ error: 'Link bulunamadı.' }, { status: 404 });
    }

    const clicks = Number(link.clicks ?? 0) + 1;
    await kv.set(key, { ...link, clicks });

    return NextResponse.json({ ok: true, clicks });
  } catch (error) {
    return NextResponse.json({ error: 'Tıklama kaydedilemedi.', detail: error.message }, { status: 500 });
  }
}
