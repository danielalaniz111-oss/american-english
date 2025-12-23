import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  const date = new Date(dateParam);

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');
    const bookingsCollection = db.collection('bookings');

    const classes = await classesCollection.find({
      startDate: {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      },
    }).sort({ startDate: 1 }).toArray();

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
