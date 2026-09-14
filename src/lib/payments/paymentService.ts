import type { PaymentProvider, CreatePaymentParams, PaymentIntent, PaymentResult } from './types';
import { StubPaymentProvider } from './stubProvider';
import { MonobankProvider } from './monoProvider';
import { StripeProvider } from './stripeProvider';

/**
 * Payment Service Facade — MAP Platform
 *
 * Provides a unified API for payment operations regardless of the underlying provider.
 * The active provider is determined by the PAYMENT_MODE environment variable.
 *
 * Usage:
 *   import { paymentService } from '@/lib/payments/paymentService';
 *   const intent = await paymentService.createPayment({ ... });
 */

let cachedProvider: PaymentProvider | null = null;

function getProvider(): PaymentProvider {
  if (cachedProvider) return cachedProvider;

  const mode = process.env.PAYMENT_MODE || 'stub';

  switch (mode) {
    case 'monobank':
      cachedProvider = new MonobankProvider();
      break;
    case 'stripe':
      cachedProvider = new StripeProvider();
      break;
    case 'stub':
    default:
      cachedProvider = new StubPaymentProvider();
      break;
  }

  console.log(`💳 Payment provider initialized: ${cachedProvider.name} (PAYMENT_MODE=${mode})`);
  return cachedProvider;
}

export const paymentService = {
  /**
   * Get the name of the active payment provider.
   */
  getProviderName(): string {
    return getProvider().name;
  },

  /**
   * Check if payments are in stub/demo mode.
   */
  isStubMode(): boolean {
    return getProvider().name === 'stub';
  },

  /**
   * Create a payment intent.
   *
   * In stub mode: returns immediately with status 'completed'.
   * In real mode: returns 'pending' with a checkoutUrl for redirect.
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    return getProvider().createPayment(params);
  },

  /**
   * Verify the status of a payment.
   */
  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    return getProvider().verifyPayment(paymentId);
  },

  /**
   * Handle incoming webhook from the payment provider.
   * Only applicable for real payment providers (Monobank, Stripe).
   * Stub provider does not use webhooks.
   */
  async handleWebhook(body: unknown, signature?: string): Promise<PaymentResult> {
    const provider = getProvider();
    if (!provider.handleWebhook) {
      return { success: false, paymentId: '', amount: 0, displayAmount: 0, error: 'Provider does not support webhooks' };
    }
    return provider.handleWebhook(body, signature);
  },
};
