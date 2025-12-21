import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classDetails = await prisma.class.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!classDetails) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(classDetails);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Error fetching class' }, { status: 500 });
  }
}