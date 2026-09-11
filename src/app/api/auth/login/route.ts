import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, generateSessionToken, SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Логін та пароль є обов’язковими' },
        { status: 400 }
      );
    }

    const user = verifyCredentials(username, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Невірний логін або пароль. Перевірте введені дані.' },
        { status: 401 }
      );
    }

    const token = generateSessionToken(user);
    const response = NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
