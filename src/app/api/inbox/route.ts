import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/data/store';
import { verifyAdminSession } from '../../../lib/auth';

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Потрібна авторизація адміністратора' },
      { status: 401 }
    );
  }
  const db = await getDatabase();
  return NextResponse.json({ messages: db.inbox || [] });
}

