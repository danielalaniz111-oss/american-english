import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { t } from '@/lib/translations';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const stats = await Promise.all([
    prisma.class.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.service.count(),
  ]);

  const [classCount, bookingCount, userCount, serviceCount] = stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{t.admin.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Clases</h3>
          <p className="text-3xl font-bold text-blue-600">{classCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Reservas</h3>
          <p className="text-3xl font-bold text-green-600">{bookingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Usuarios</h3>
          <p className="text-3xl font-bold text-purple-600">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Servicios</h3>
          <p className="text-3xl font-bold text-orange-600">{serviceCount}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/classes"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{t.admin.classes}</h2>
          <p className="text-gray-600">Crear, editar y eliminar clases</p>
        </Link>
        
        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{t.admin.bookings}</h2>
          <p className="text-gray-600">Ver y gestionar todas las reservas</p>
        </Link>
        
        <Link
          href="/admin/services"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{t.admin.services}</h2>
          <p className="text-gray-600">Gestionar los servicios ofrecidos</p>
        </Link>
        
        <Link
          href="/admin/users"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{t.admin.users}</h2>
          <p className="text-gray-600">Ver y gestionar usuarios</p>
        </Link>
      </div>
    </div>
  );
}