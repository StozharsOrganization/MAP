import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/payments/paymentService';
import { donateToProject } from '../../../../lib/data/store';
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit';
import { revalidatePath } from 'next/cache';
import type { PaymentCurrency, PaymentFrequency } from '../../../../lib/payments/types';

// Rate limit: 10 payment creations per 5 minutes per IP
const PAYMENT_RATE_LIMIT = { maxRequests: 10, windowMs: 5 * 60 * 1000 };

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers);
    const rateLimitResult = checkRateLimit(`payment:${ip}`, PAYMENT_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Забагато запитів. Спробуйте через кілька хвилин.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { projectId, projectTitle, amount, frequency, paymentMethod, donorName, donorEmail } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0 || numAmount > 1_000_000) {
      return NextResponse.json(
        { success: false, error: 'Невірна сума внеску (1 — 1 000 000 ₴)' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://map.org.ua';

    // Create payment through the active provider
    const intent = await paymentService.createPayment({
      amount: numAmount * 100, // Convert to kopiykas
      displayAmount: numAmount,
      currency: 'UAH' as PaymentCurrency,
      projectId,
      projectTitle,
      donorName: donorName || 'Анонімний благодійник',
      donorEmail,
      frequency: (frequency || 'once') as PaymentFrequency,
      returnUrl: `${siteUrl}/projects`,
    });

    // In stub mode: payment is completed immediately — record the donation
    if (intent.status === 'completed') {
      const result = await donateToProject({
        projectId,
        amount: numAmount,
        frequency: frequency || 'once',
        paymentMethod: paymentMethod || paymentService.getProviderName(),
        donorName: donorName || 'Анонімний благодійник',
        donorEmail,
      });

      revalidatePath('/');
      revalidatePath('/projects');

      return NextResponse.json({
        success: true,
        mode: paymentService.getProviderName(),
        project: result.project,
        newRaisedAmount: result.newRaisedAmount,
        donation: result.donation,
      });
    }

    // In real mode: return checkoutUrl for client-side redirect
    return NextResponse.json({
      success: true,
      mode: paymentService.getProviderName(),
      checkoutUrl: intent.checkoutUrl,
      paymentId: intent.id,
      status: intent.status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Помилка створення платежу';
    console.error('Payment creation error:', err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
