import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');
  
  if (!dateParam) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }
  
  const date = new Date(dateParam);
  
  try {
    const classes = await prisma.class.findMany({
      where: {
        startDate: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 });
  }
}