import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const createPreference = async (
  title: string,
  price: number,
  quantity: number,
  bookingId: string
) => {
  const preference = new Preference(client);
  
  const response = await preference.create({
    body: {
      items: [
        {
          id: bookingId,
          title: title,
          quantity: quantity,
          unit_price: price,
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/payment/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercadopago`,
      external_reference: bookingId,
    }
  });

  return response;
}