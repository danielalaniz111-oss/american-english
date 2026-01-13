'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Error en el Pago
        </h1>

        <p className="text-gray-600 mb-6">
          Hubo un problema al procesar tu pago. Por favor, intentá nuevamente o elegí otro método de pago.
        </p>

        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">
            Si el problema persiste, contactanos por WhatsApp o email para asistirte.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/clases"
            className="block w-full py-3 px-6 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
          >
            Intentar nuevamente
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
