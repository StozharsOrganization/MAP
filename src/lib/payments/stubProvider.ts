import crypto from 'crypto';
import type { PaymentProvider, CreatePaymentParams, PaymentIntent, PaymentResult } from './types';

/**
 * StubPaymentProvider — Demo/Testing payment provider.
 *
 * Simulates a successful payment instantly without any external API calls.
 * The payment is recorded as "completed" immediately.
 *
 * This is the default provider when PAYMENT_MODE is not set or set to 'stub'.
 */
export class StubPaymentProvider implements PaymentProvider {
  readonly name = 'stub';

  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    // Simulate a brief processing delay (100-300ms) for realism
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    const id = crypto.randomUUID();

    return {
      id,
      externalId: `stub-${id.slice(0, 8)}`,
      status: 'completed', // Stub always succeeds immediately
      // No checkoutUrl — no redirect needed
      amount: params.amount,
      displayAmount: params.displayAmount,
      currency: params.currency,
      provider: this.name,
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    // Stub payments are always verified as successful
    return {
      success: true,
      paymentId,
      amount: 0,
      displayAmount: 0,
    };
  }

  // No webhook handler needed for stub
}
