import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  const link = await kv.get(`link:${id}`);
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(link);
}

export async function POST(request, { params }) {
  const { id } = params;
  const link = await kv.get(`link:${id}`);
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  link.clicks = (link.clicks || 0) + 1;
  await kv.set(`link:${id}`, link);
  return NextResponse.json(link);
}

