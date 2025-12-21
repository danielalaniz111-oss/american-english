import { t } from '@/lib/translations';
import { prisma } from '@/lib/db';

export default async function ServicesPage() {
  const services = await prisma.service.findMany();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">{t.services.title}</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        {t.services.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-3">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            {service.price && (
              <p className="text-xl font-bold text-blue-600">
                ${service.price} ARS
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}