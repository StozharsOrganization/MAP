import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/payments/paymentService';
import { donateToProject } from '../../../../lib/data/store';
import { revalidatePath } from 'next/cache';

/**
 * Webhook handler for payment provider callbacks.
 *
 * Monobank and Stripe will POST to this endpoint when a payment is completed/failed.
 * In stub mode, this endpoint is not used (payments complete immediately).
 */
export async function POST(req: NextRequest) {
  try {
    if (paymentService.isStubMode()) {
      return NextResponse.json(
        { success: false, error: 'Webhooks are not used in stub mode' },
        { status: 400 }
      );
    }

    const signature = req.headers.get('x-webhook-signature') ||
                      req.headers.get('stripe-signature') || undefined;
    const body = await req.text();

    const result = await paymentService.handleWebhook(body, signature);

    if (result.success) {
      // Record the donation in the database
      // NOTE: In production, you'd extract projectId and donor info from the webhook payload
      await donateToProject({
        amount: result.displayAmount,
        frequency: 'once',
        paymentMethod: paymentService.getProviderName(),
      });

      revalidatePath('/');
      revalidatePath('/projects');
    }

    return NextResponse.json({ received: true, success: result.success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing error';
    console.error('Webhook error:', err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
