import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Switch between test account and production credentials
const useTestAccount = process.env.USE_MERCADO_TEST_ACCOUNT === 'true';

const accessToken = useTestAccount
  ? process.env.TEST_ACCOUNT_ACCES_TOKEN!
  : process.env.MERCADOPAGO_ACCESS_TOKEN!;

const client = new MercadoPagoConfig({
  accessToken: accessToken,
});

console.log(`MercadoPago: Using ${useTestAccount ? 'TEST ACCOUNT' : 'PRODUCTION'} credentials`);

// Use VERCEL_URL (auto-provided by Vercel), APP_URL, or fallback to localhost
const getBaseUrl = () => {
  // VERCEL_URL is automatically set by Vercel for all deployments (including preview branches)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.APP_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
};

export interface BookingData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  buyerEmail: string;
  buyerName: string;
  buyerLastName: string;
  bookingId: string;
  serviceType: string;
  selectedDate: string;
  selectedTime: string;
}

export const createPreference = async (data: BookingData) => {
  const preference = new Preference(client);
  const baseUrl = getBaseUrl();
  const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

  // Build preference body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preferenceBody: any = {
    items: [
      {
        id: data.bookingId,
        title: data.title,
        description: data.description,
        quantity: data.quantity,
        unit_price: data.price,
        currency_id: 'ARS',
      }
    ],
    payer: {
      email: data.buyerEmail,
      name: data.buyerName,
      surname: data.buyerLastName,
    },
    external_reference: data.bookingId,
    metadata: {
      service_type: data.serviceType,
      selected_date: data.selectedDate,
      selected_time: data.selectedTime,
      buyer_name: `${data.buyerName} ${data.buyerLastName}`,
      buyer_email: data.buyerEmail,
    },
  };

  // Only add back_urls and auto_return for HTTPS (production)
  // MercadoPago requires HTTPS for back_urls
  if (!isLocalhost) {
    preferenceBody.back_urls = {
      success: `${baseUrl}/pago/exito`,
      failure: `${baseUrl}/pago/error`,
      pending: `${baseUrl}/pago/pendiente`
    };
    preferenceBody.auto_return = 'approved';
    preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
  }

  const response = await preference.create({
    body: preferenceBody
  });

  return response;
};

export const getPayment = async (paymentId: string) => {
  const payment = new Payment(client);
  return await payment.get({ id: paymentId });
};