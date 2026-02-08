import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { rows } = await sql`SELECT name, answers, mvp, created_at FROM submissions ORDER BY created_at DESC;`;
    
    return new NextResponse(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
