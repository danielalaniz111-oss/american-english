import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');
    const bookingsCollection = db.collection('bookings');

    const classes = await classesCollection
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    // Get booking counts for each class
    const classesWithCounts = await Promise.all(
      classes.map(async (classItem) => {
        const bookingCount = await bookingsCollection.countDocuments({
          classId: classItem._id,
        });
        return {
          ...classItem,
          id: classItem._id.toString(),
          _count: { bookings: bookingCount },
        };
      })
    );

    return NextResponse.json(classesWithCounts);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');

    const now = new Date();
    const result = await classesCollection.insertOne({
      title: body.title,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      capacity: body.capacity,
      price: body.price,
      createdAt: now,
      updatedAt: now,
    });

    const newClass = await classesCollection.findOne({ _id: result.insertedId });

    return NextResponse.json({
      ...newClass,
      id: newClass?._id.toString(),
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Error creating class' }, { status: 500 });
  }
}
