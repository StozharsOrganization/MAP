import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/data/store';

export async function GET() {
  try {
    const db = await getDatabase();
    return NextResponse.json({
      success: true,
      projects: db.projects || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
