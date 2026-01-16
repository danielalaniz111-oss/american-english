import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const bookingsCollection = db.collection('bookings');

    // Get all bookings for this date that are pending or confirmed
    const bookings = await bookingsCollection
      .find({
        selectedDate: date,
        status: { $in: ['pending', 'confirmed'] }
      })
      .toArray();

    // Extract booked times
    const bookedTimes = bookings.map(booking => booking.selectedTime);

    return NextResponse.json({
      date: date,
      bookedTimes: bookedTimes,
    });
  } catch (error) {
    console.error('Error fetching booked times:', error);
    return NextResponse.json(
      { error: 'Error fetching booked times' },
      { status: 500 }
    );
  }
}
