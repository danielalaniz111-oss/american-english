import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');

    const result = await classesCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title: body.title,
          description: body.description,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          capacity: body.capacity,
          price: body.price,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const updatedClass = await classesCollection.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      ...updatedClass,
      id: updatedClass?._id.toString(),
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Error updating class' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const classesCollection = db.collection('classes');

    const result = await classesCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Error deleting class' }, { status: 500 });
  }
}
