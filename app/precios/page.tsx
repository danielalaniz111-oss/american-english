import { t } from '@/lib/translations';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Clase Individual',
    price: 5000,
    features: [
      'Acceso a 1 clase',
      'Instructor certificado',
      'Material incluido',
      'Grupos reducidos'
    ]
  },
  {
    name: 'Paquete Mensual',
    price: 18000,
    features: [
      'Acceso a 4 clases',
      'Ahorro del 10%',
      'Reserva prioritaria',
      'Cancelación flexible'
    ],
    popular: true
  },
  {
    name: 'Paquete Trimestral',
    price: 50000,
    features: [
      'Acceso a 12 clases',
      'Ahorro del 17%',
      'Reserva prioritaria',
      'Clases personalizadas',
      'Soporte dedicado'
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">{t.pricing.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg shadow-lg p-8 ${
              plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                MÁS POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-600 ml-2">{t.pricing.currency}</span>
            </div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/clases"
              className={`w-full text-center py-3 px-6 rounded-lg font-semibold transition duration-300 block ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {t.pricing.bookNow}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}