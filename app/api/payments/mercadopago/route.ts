import { NextRequest, NextResponse } from 'next/server';
import { createPreference, BookingData } from '@/lib/mercadopago';
import { getDb } from '@/lib/db';
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

    // Check if time slot is already booked
    const db = await getDb();
    const bookingsCollection = db.collection('bookings');

    const existingBooking = await bookingsCollection.findOne({
      selectedDate: selectedDate,
      selectedTime: selectedTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Este horario ya está reservado. Por favor elegí otro.' },
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

    // Save pending booking to database
    await bookingsCollection.insertOne({
      externalReference: bookingId,
      status: 'pending',
      paymentStatus: 'pending',
      serviceType: serviceType,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
      buyerName: `${firstName} ${lastName}`,
      buyerFirstName: firstName,
      buyerLastName: lastName,
      buyerEmail: email,
      amount: price,
      paymentMethod: 'mercadopago',
      preferenceId: preference.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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
