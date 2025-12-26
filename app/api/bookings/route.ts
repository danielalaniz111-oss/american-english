import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';
import { createPreference } from '@/lib/mercadopago';
import { ObjectId } from 'mongodb';
import { BookingStatus, PaymentStatus } from '@/lib/types';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId } = await request.json();

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');
    const bookingsCollection = db.collection('bookings');

    const classDetails = await classesCollection.findOne({
      _id: new ObjectId(classId),
    });

    if (!classDetails) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const bookingCount = await bookingsCollection.countDocuments({
      classId: new ObjectId(classId),
    });

    const spotsLeft = classDetails.capacity - bookingCount;
    if (spotsLeft <= 0) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 });
    }

    const existingBooking = await bookingsCollection.findOne({
      userId: new ObjectId(session.user.id),
      classId: new ObjectId(classId),
    });

    if (existingBooking) {
      return NextResponse.json({ error: 'Already booked for this class' }, { status: 400 });
    }

    const now = new Date();
    const result = await bookingsCollection.insertOne({
      userId: new ObjectId(session.user.id),
      classId: new ObjectId(classId),
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });

    const bookingId = result.insertedId.toString();

    const preference = await createPreference(
      classDetails.title,
      classDetails.price,
      1,
      bookingId
    );

    return NextResponse.json({
      bookingId,
      preferenceId: preference.id,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Error creating booking' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const bookingsCollection = db.collection('bookings');
    const classesCollection = db.collection('classes');

    const bookings = await bookingsCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate class details for each booking
    const bookingsWithClass = await Promise.all(
      bookings.map(async (booking) => {
        const classDetails = await classesCollection.findOne({
          _id: booking.classId,
        });
        return {
          ...booking,
          id: booking._id.toString(),
          class: classDetails
            ? { ...classDetails, id: classDetails._id.toString() }
            : null,
        };
      })
    );

    return NextResponse.json(bookingsWithClass);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}
