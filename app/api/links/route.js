import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Tüm Linkleri Getir
export async function GET() {
  try {
    const keys = await kv.keys('link:*');
    if (keys.length === 0) return NextResponse.json([]);
    const links = await kv.mget(...keys);
    // Tıklama sayılarına göre sırala
    return NextResponse.json(links.filter(Boolean).sort((a,b) => b.createdAt - a.createdAt));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni Link Kaydet
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, targetUrl, tasks, linkMode, secretText, generatedKey } = body;
    
    const newLink = {
      id,
      targetUrl,
      tasks,
      linkMode,
      secretText,
      generatedKey,
      clicks: 0,
      createdAt: Date.now()
    };

    await kv.set(`link:${id}`, newLink);
    return NextResponse.json(newLink);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

