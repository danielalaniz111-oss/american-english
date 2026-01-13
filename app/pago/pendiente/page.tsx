'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PendingContent() {
  const searchParams = useSearchParams();
  const externalReference = searchParams.get('external_reference');

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-12 w-12 text-yellow-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Pago Pendiente
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se confirme tu reserva.
        </p>

        {externalReference && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Referencia de Reserva</p>
            <p className="font-mono text-gray-700 text-sm break-all">{externalReference}</p>
          </div>
        )}

        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-700">
            Los pagos con transferencia pueden demorar hasta 24 horas en acreditarse.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/clases"
            className="block w-full py-3 px-6 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
          >
            Reservar otra clase
          </Link>

          <Link
            href="/"
            className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
