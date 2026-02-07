import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, answers, mvp } = await request.json();

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        answers JSONB NOT NULL,
        mvp TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert the submission
    await sql`
      INSERT INTO submissions (name, answers, mvp)
      VALUES (${name}, ${JSON.stringify(answers)}, ${mvp});
    `;

    return NextResponse.json({ message: 'Submission successful' }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
