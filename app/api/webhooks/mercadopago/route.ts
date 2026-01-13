import { NextRequest, NextResponse } from 'next/server';
import { getPayment } from '@/lib/mercadopago';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('MercadoPago webhook received:', JSON.stringify(body, null, 2));

    // MercadoPago sends different types of notifications
    if (body.type === 'payment') {
      const paymentId = body.data?.id;

      if (paymentId) {
        // Get payment details from MercadoPago
        const payment = await getPayment(paymentId);

        console.log('Payment details:', JSON.stringify(payment, null, 2));

        const status = payment.status;
        const externalReference = payment.external_reference;
        const metadata = payment.metadata || {};

        // Store booking in database
        if (status === 'approved') {
          const db = await getDb();
          const bookingsCollection = db.collection('bookings');

          // Check if booking already exists
          const existingBooking = await bookingsCollection.findOne({
            externalReference: externalReference,
          });

          if (!existingBooking) {
            await bookingsCollection.insertOne({
              externalReference: externalReference,
              paymentId: paymentId,
              status: 'confirmed',
              paymentStatus: status,
              serviceType: metadata.service_type,
              selectedDate: metadata.selected_date,
              selectedTime: metadata.selected_time,
              buyerName: metadata.buyer_name,
              buyerEmail: metadata.buyer_email,
              amount: payment.transaction_amount,
              paymentMethod: 'mercadopago',
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            console.log('Booking created for:', externalReference);
          } else {
            // Update existing booking
            await bookingsCollection.updateOne(
              { externalReference: externalReference },
              {
                $set: {
                  paymentStatus: status,
                  updatedAt: new Date(),
                },
              }
            );

            console.log('Booking updated for:', externalReference);
          }
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent retries
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// MercadoPago also sends GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
