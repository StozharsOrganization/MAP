import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/data/store';

export async function GET() {
  try {
    const db = await getDatabase();
    return NextResponse.json({
      success: true,
      projects: db.projects || [],
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Невідома помилка' },
      { status: 500 }
    );
  }
}
