import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const { id } = params;
  const link = await kv.get(`link:${id}`);

  if (!link) {
    return NextResponse.json({ error: 'Link bulunamadı' }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function POST(_request, { params }) {
  const { id } = params;
  const key = `link:${id}`;
  const link = await kv.get(key);

  if (!link) {
    return NextResponse.json({ error: 'Link bulunamadı' }, { status: 404 });
  }

  link.clicks = (link.clicks ?? 0) + 1;
  await kv.set(key, link);

  return NextResponse.json({ ok: true, clicks: link.clicks });
}
