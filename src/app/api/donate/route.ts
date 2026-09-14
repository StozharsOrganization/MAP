import { NextRequest, NextResponse } from 'next/server';
import { donateToProject, getDonations } from '../../../lib/data/store';
import { verifyAdminSession } from '../../../lib/auth';
import { revalidatePath } from 'next/cache';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

// Rate limit: 10 donations per 5 minutes per IP
const DONATE_RATE_LIMIT = { maxRequests: 10, windowMs: 5 * 60 * 1000 };

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers);
    const rateLimitResult = checkRateLimit(`donate:${ip}`, DONATE_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Забагато запитів. Спробуйте через кілька хвилин.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const { projectId, amount, frequency, paymentMethod, donorName, donorEmail } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Сума внеску повинна бути більшою за нуль' },
        { status: 400 }
      );
    }

    if (numAmount > 1_000_000) {
      return NextResponse.json(
        { success: false, error: 'Максимальна сума внеску — 1 000 000 ₴' },
        { status: 400 }
      );
    }

    const result = await donateToProject({
      projectId,
      amount: numAmount,
      frequency: frequency || 'once',
      paymentMethod: paymentMethod || 'card',
      donorName,
      donorEmail,
    });

    revalidatePath('/');
    revalidatePath('/projects');

    return NextResponse.json({
      success: true,
      project: result.project,
      newRaisedAmount: result.newRaisedAmount,
      donation: result.donation,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Помилка обробки донату';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isAuthorized = await verifyAdminSession(['admin']);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Доступ до журналу внесків має лише Головний адміністратор' },
        { status: 403 }
      );
    }

    const donations = await getDonations();
    return NextResponse.json({ success: true, donations });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
