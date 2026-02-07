import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  // Log for Vercel Dashboard (Only you can see this in logs)
  console.log('Admin login attempt');

  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD environment variable is not set!');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await sql`SELECT * FROM submissions ORDER BY created_at DESC;`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
