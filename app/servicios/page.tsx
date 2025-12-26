import { t } from '@/lib/translations';
import { Clock, CalendarDays, CalendarRange } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 1,
    name: 'Clases Particulares',
    duration: '1 hora',
    description: 'Clases individuales personalizadas adaptadas a tu nivel y objetivos. Ideal para quienes buscan atención exclusiva y avanzar a su propio ritmo.',
    features: [
      'Atención personalizada',
      'Horarios flexibles',
      'Material adaptado a tus necesidades',
      'Seguimiento individual'
    ],
    icon: Clock,
  },
  {
    id: 2,
    name: 'Clases Semanales',
    duration: '1 hora por semana',
    description: 'Mantén tu aprendizaje constante con una clase semanal. Perfecto para quienes quieren mejorar gradualmente sin comprometer demasiado tiempo.',
    features: [
      'Una clase por semana',
      'Continuidad en el aprendizaje',
      'Práctica regular',
      'Progreso sostenido'
    ],
    icon: CalendarDays,
  },
  {
    id: 3,
    name: 'Clases Mensuales',
    duration: '1 hora por semana (4 clases/mes)',
    description: 'El plan más completo para un aprendizaje intensivo. Incluye 4 clases mensuales con seguimiento continuo y material de estudio.',
    features: [
      '4 clases al mes',
      'Mejor precio por clase',
      'Material incluido',
      'Seguimiento mensual de progreso'
    ],
    icon: CalendarRange,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">{t.services.title}</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          {t.services.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-center mb-2">{service.name}</h3>
                <p className="text-blue-600 font-medium text-center mb-4">{service.duration}</p>
                <p className="text-gray-600 mb-4 text-center">{service.description}</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/clases"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-blue-700 transition duration-300 mt-auto"
                >
                  Ver Disponibilidad
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
