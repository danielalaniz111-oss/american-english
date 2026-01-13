import { NextRequest, NextResponse } from 'next/server';
import { createPreference, BookingData } from '@/lib/mercadopago';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      serviceType,
      serviceName,
      price,
      selectedDate,
      selectedTime,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !serviceType || !price || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Generate unique booking ID
    const bookingId = uuidv4();

    // Create MercadoPago preference
    const bookingData: BookingData = {
      title: serviceName || `Clase de Inglés - ${serviceType}`,
      description: `Reserva para ${firstName} ${lastName} - ${selectedDate} a las ${selectedTime}`,
      price: price,
      quantity: 1,
      buyerEmail: email,
      buyerName: firstName,
      buyerLastName: lastName,
      bookingId: bookingId,
      serviceType: serviceType,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
    };

    const preference = await createPreference(bookingData);

    return NextResponse.json({
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      bookingId: bookingId,
    });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
