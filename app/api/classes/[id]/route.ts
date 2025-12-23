import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');
    const bookingsCollection = db.collection('bookings');

    const classDetails = await classesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!classDetails) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const bookingCount = await bookingsCollection.countDocuments({
      classId: new ObjectId(id),
    });

    return NextResponse.json({
      ...classDetails,
      id: classDetails._id.toString(),
      _count: { bookings: bookingCount },
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Error fetching class' }, { status: 500 });
  }
}
