import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

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
    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        capacity: body.capacity,
        price: body.price,
      },
    });
    
    return NextResponse.json(updatedClass);
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
    await prisma.class.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Error deleting class' }, { status: 500 });
  }
}