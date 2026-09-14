/**
 * Payment System Types — MAP Platform
 *
 * This module defines the interfaces for the Payment Adapter Pattern.
 * All payment providers (Stub, Monobank, Stripe) implement PaymentProvider.
 */

export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentFrequency = 'once' | 'monthly';
export type PaymentCurrency = 'UAH' | 'EUR' | 'USD';

export interface CreatePaymentParams {
  /** Amount in the smallest currency unit (kopiykas for UAH, cents for EUR/USD) */
  amount: number;
  /** Display amount (human-readable, e.g. 500 for 500 UAH) */
  displayAmount: number;
  currency: PaymentCurrency;
  projectId?: string;
  projectTitle?: string;
  donorName?: string;
  donorEmail?: string;
  frequency: PaymentFrequency;
  /** URL to redirect after payment completion */
  returnUrl: string;
}

export interface PaymentIntent {
  /** Internal payment ID */
  id: string;
  /** External ID from the payment provider (Monobank invoice ID, Stripe session ID, etc.) */
  externalId?: string;
  status: PaymentStatus;
  /** Redirect URL for payment (null for stub — payment is instant) */
  checkoutUrl?: string;
  amount: number;
  displayAmount: number;
  currency: PaymentCurrency;
  provider: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  amount: number;
  displayAmount: number;
  error?: string;
}

/**
 * PaymentProvider interface — implement this for each payment gateway.
 *
 * Lifecycle:
 * 1. createPayment() — initiate a payment intent
 *    - Stub: returns completed immediately
 *    - Monobank/Stripe: returns pending + checkoutUrl for redirect
 * 2. verifyPayment() — check payment status (polling fallback)
 * 3. handleWebhook() — process webhook callback from payment provider
 *    - Only Monobank/Stripe need this; Stub is a no-op
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(params: CreatePaymentParams): Promise<PaymentIntent>;
  verifyPayment(paymentId: string): Promise<PaymentResult>;
  handleWebhook?(body: unknown, signature?: string): Promise<PaymentResult>;
}
