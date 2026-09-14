import type { PaymentProvider, CreatePaymentParams, PaymentIntent, PaymentResult } from './types';

/**
 * StripeProvider — Stripe Checkout integration for international payments.
 *
 * HOW TO CONNECT:
 * 1. Create a Stripe account at https://dashboard.stripe.com/
 * 2. Get your API keys from the Dashboard
 * 3. Set environment variables:
 *    - STRIPE_SECRET_KEY=sk_live_...
 *    - STRIPE_WEBHOOK_SECRET=whsec_...
 *    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
 *    - PAYMENT_MODE=stripe
 * 4. Install Stripe SDK: npm install stripe
 * 5. Configure webhook endpoint in Stripe Dashboard:
 *    - https://your-domain.com/api/payments/webhook
 *    - Events: checkout.session.completed
 *
 * API Documentation: https://stripe.com/docs/api
 */
export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe';

  private getSecretKey(): string {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. ' +
        'Set it in .env to use Stripe as payment provider.'
      );
    }
    return key;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    const _secretKey = this.getSecretKey();

    // TODO: Replace with actual Stripe Checkout Session creation
    // const stripe = new Stripe(secretKey);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: params.currency.toLowerCase(),
    //       product_data: {
    //         name: params.projectTitle
    //           ? `Благодійний внесок — ${params.projectTitle}`
    //           : 'Благодійний внесок — ГО MAP',
    //         description: 'Внесок на підтримку молодіжних ініціатив MAP',
    //       },
    //       unit_amount: params.amount, // in cents
    //     },
    //     quantity: 1,
    //   }],
    //   mode: params.frequency === 'monthly' ? 'subscription' : 'payment',
    //   success_url: `${params.returnUrl}?payment=success`,
    //   cancel_url: `${params.returnUrl}?payment=cancelled`,
    //   metadata: {
    //     projectId: params.projectId || 'general',
    //     donorName: params.donorName || 'Anonymous',
    //     donorEmail: params.donorEmail || '',
    //   },
    // });
    //
    // return {
    //   id: crypto.randomUUID(),
    //   externalId: session.id,
    //   status: 'pending',
    //   checkoutUrl: session.url!,
    //   amount: params.amount,
    //   displayAmount: params.displayAmount,
    //   currency: params.currency,
    //   provider: this.name,
    // };

    throw new Error(
      'StripeProvider is not yet implemented. ' +
      'Install stripe SDK (npm install stripe) and uncomment the API call above.'
    );
  }

  async verifyPayment(_paymentId: string): Promise<PaymentResult> {
    // TODO: Retrieve Stripe Checkout Session to check status
    // const stripe = new Stripe(this.getSecretKey());
    // const session = await stripe.checkout.sessions.retrieve(paymentId);
    throw new Error('StripeProvider.verifyPayment() is not yet implemented.');
  }

  async handleWebhook(body: unknown, signature?: string): Promise<PaymentResult> {
    // TODO: Verify webhook signature and process payment
    // const stripe = new Stripe(this.getSecretKey());
    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    // const event = stripe.webhooks.constructEvent(body as string, signature!, webhookSecret);
    //
    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object;
    //   return {
    //     success: true,
    //     paymentId: session.id,
    //     amount: session.amount_total || 0,
    //     displayAmount: Math.round((session.amount_total || 0) / 100),
    //   };
    // }
    // return { success: false, paymentId: '', amount: 0, displayAmount: 0, error: event.type };

    throw new Error('StripeProvider.handleWebhook() is not yet implemented.');
  }
}
