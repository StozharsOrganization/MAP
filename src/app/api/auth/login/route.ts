import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, generateSessionToken, SESSION_COOKIE_NAME } from '../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit';

// Rate limit: 5 login attempts per 15 minutes per IP
const LOGIN_RATE_LIMIT = { maxRequests: 5, windowMs: 15 * 60 * 1000 };

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers);
    const rateLimitResult = checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Забагато спроб входу. Спробуйте через 15 хвилин.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Логін та пароль є обов\'язковими' },
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
  } catch (err: unknown) {
    console.error('Login error:', err);
    const message = err instanceof Error ? err.message : 'Внутрішня помилка сервера';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
