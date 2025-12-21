'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { t } from '@/lib/translations';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Class {
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

export default function ClassesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (selectedDate) {
      fetchClasses(selectedDate);
    }
  }, [selectedDate]);

  const fetchClasses = async (date: Date) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/classes?date=${format(date, 'yyyy-MM-dd')}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (classId: string) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    router.push(`/booking/${classId}`);
  };

  const getSpotsLeft = (cls: Class) => {
    return cls.capacity - cls._count.bookings;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">{t.booking.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t.booking.selectDate}</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              locale="es-ES"
              minDate={new Date()}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t.booking.availableClasses}</h2>
          {loading ? (
            <div className="text-center py-8">{t.messages.loading}</div>
          ) : selectedDate ? (
            classes.length > 0 ? (
              <div className="space-y-4">
                {classes.map((cls) => {
                  const spotsLeft = getSpotsLeft(cls);
                  const isFull = spotsLeft === 0;
                  
                  return (
                    <div key={cls.id} className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold mb-2">{cls.title}</h3>
                      {cls.description && (
                        <p className="text-gray-600 mb-3">{cls.description}</p>
                      )}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {format(new Date(cls.startDate), 'HH:mm', { locale: es })} - 
                            {format(new Date(cls.endDate), 'HH:mm', { locale: es })}
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            ${cls.price} ARS
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                            {isFull ? 'Completo' : `${spotsLeft} ${t.booking.spotsLeft}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBooking(cls.id)}
                        disabled={isFull}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                          isFull
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isFull ? 'Clase Completa' : t.pricing.bookNow}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                No hay clases disponibles para esta fecha
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              Selecciona una fecha para ver las clases disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}