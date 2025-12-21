'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { t } from '@/lib/translations';

interface ClassDetails {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
  _count: {
    bookings: number;
  };
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchClassDetails();
  }, [session]);

  const fetchClassDetails = async () => {
    try {
      const response = await fetch(`/api/classes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setClassDetails(data);
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: params.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.preferenceId) {
          window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.preferenceId}`;
        }
      } else {
        alert('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error al procesar la reserva');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{t.messages.loading}</div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Clase no encontrada</div>
      </div>
    );
  }

  const spotsLeft = classDetails.capacity - classDetails._count.bookings;
  const isFull = spotsLeft === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{t.booking.confirmBooking}</h1>
        
        <div className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-semibold mb-3">{classDetails.title}</h2>
          {classDetails.description && (
            <p className="text-gray-600 mb-4">{classDetails.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Fecha:</span>
              <p>{format(new Date(classDetails.startDate), 'dd/MM/yyyy', { locale: es })}</p>
            </div>
            <div>
              <span className="font-semibold">Horario:</span>
              <p>
                {format(new Date(classDetails.startDate), 'HH:mm', { locale: es })} - 
                {format(new Date(classDetails.endDate), 'HH:mm', { locale: es })}
              </p>
            </div>
            <div>
              <span className="font-semibold">Precio:</span>
              <p className="text-xl font-bold text-blue-600">${classDetails.price} ARS</p>
            </div>
            <div>
              <span className="font-semibold">Lugares disponibles:</span>
              <p className={isFull ? 'text-red-600' : 'text-green-600'}>
                {spotsLeft} de {classDetails.capacity}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Información del estudiante</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><span className="font-semibold">Nombre:</span> {session?.user?.name}</p>
            <p><span className="font-semibold">Email:</span> {session?.user?.email}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
          >
            {t.forms.cancel}
          </button>
          <button
            onClick={handleBooking}
            disabled={booking || isFull}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition duration-300 ${
              booking || isFull
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {booking ? t.messages.loading : t.booking.payNow}
          </button>
        </div>
      </div>
    </div>
  );
}