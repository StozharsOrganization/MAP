import type { PaymentProvider, CreatePaymentParams, PaymentIntent, PaymentResult } from './types';

/**
 * MonobankProvider — Monobank Acquiring API integration.
 *
 * HOW TO CONNECT:
 * 1. Register at https://api.monobank.ua/
 * 2. Get your API token (X-Token)
 * 3. Set environment variables:
 *    - MONOBANK_API_TOKEN=your_token_here
 *    - PAYMENT_MODE=monobank
 * 4. Configure webhook URL in Monobank dashboard:
 *    - https://your-domain.com/api/payments/webhook
 *
 * API Documentation: https://api.monobank.ua/docs/acquiring.html
 */
export class MonobankProvider implements PaymentProvider {
  readonly name = 'monobank';

  private getApiToken(): string {
    const token = process.env.MONOBANK_API_TOKEN;
    if (!token) {
      throw new Error(
        'MONOBANK_API_TOKEN is not set. ' +
        'Set it in .env to use Monobank as payment provider.'
      );
    }
    return token;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    const token = this.getApiToken();

    // TODO: Replace with actual Monobank Acquiring API call
    // const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
    //   method: 'POST',
    //   headers: {
    //     'X-Token': token,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     amount: params.amount, // in kopiykas
    //     ccy: 980, // UAH currency code
    //     merchantPaymInfo: {
    //       reference: params.projectId || 'general',
    //       destination: params.projectTitle
    //         ? `Благодійний внесок на проєкт "${params.projectTitle}"`
    //         : 'Благодійний внесок на діяльність ГО MAP',
    //     },
    //     redirectUrl: params.returnUrl,
    //     webHookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook`,
    //     validity: 3600, // 1 hour
    //   }),
    // });
    //
    // const data = await response.json();
    // return {
    //   id: crypto.randomUUID(),
    //   externalId: data.invoiceId,
    //   status: 'pending',
    //   checkoutUrl: data.pageUrl,
    //   amount: params.amount,
    //   displayAmount: params.displayAmount,
    //   currency: params.currency,
    //   provider: this.name,
    // };

    throw new Error(
      'MonobankProvider is not yet implemented. ' +
      'Uncomment the API call above and configure your Monobank API token.'
    );
  }

  async verifyPayment(_paymentId: string): Promise<PaymentResult> {
    // TODO: Call Monobank API to check invoice status
    // GET https://api.monobank.ua/api/merchant/invoice/status?invoiceId={paymentId}
    throw new Error('MonobankProvider.verifyPayment() is not yet implemented.');
  }

  async handleWebhook(body: unknown, _signature?: string): Promise<PaymentResult> {
    // TODO: Verify webhook signature and process payment result
    // The webhook body contains: invoiceId, status, amount, ccy, etc.
    //
    // const data = body as { invoiceId: string; status: string; amount: number };
    // if (data.status === 'success') {
    //   return {
    //     success: true,
    //     paymentId: data.invoiceId,
    //     amount: data.amount,
    //     displayAmount: Math.round(data.amount / 100),
    //   };
    // }
    // return { success: false, paymentId: data.invoiceId, amount: 0, displayAmount: 0, error: data.status };

    throw new Error('MonobankProvider.handleWebhook() is not yet implemented.');
  }
}
