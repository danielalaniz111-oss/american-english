import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { createPreference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { classId } = await request.json();
  
  try {
    const classDetails = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
    
    if (!classDetails) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    const spotsLeft = classDetails.capacity - classDetails._count.bookings;
    if (spotsLeft <= 0) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 });
    }
    
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_classId: {
          userId: session.user.id,
          classId: classId,
        },
      },
    });
    
    if (existingBooking) {
      return NextResponse.json({ error: 'Already booked for this class' }, { status: 400 });
    }
    
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        classId: classId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });
    
    const preference = await createPreference(
      classDetails.title,
      classDetails.price,
      1,
      booking.id
    );
    
    return NextResponse.json({
      bookingId: booking.id,
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
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        class: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}