import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../../lib/auth';

export async function GET() {
  const user = await getAdminSession();
  return NextResponse.json({
    authenticated: !!user,
    user: user || null,
  });
}
