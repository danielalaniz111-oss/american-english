import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const classes = await prisma.class.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
    
    return NextResponse.json(classes);
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
    const newClass = await prisma.class.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        capacity: body.capacity,
        price: body.price,
      },
    });
    
    return NextResponse.json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Error creating class' }, { status: 500 });
  }
}