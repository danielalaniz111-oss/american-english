import Link from 'next/link';
import { t } from '@/lib/translations';
import { Calendar, CreditCard, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t.home.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {t.home.hero.subtitle}
            </p>
            <Link
              href="/clases"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 inline-block"
            >
              {t.home.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t.home.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t.home.features.booking.title}
              </h3>
              <p className="text-gray-600">
                {t.home.features.booking.description}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t.home.features.payment.title}
              </h3>
              <p className="text-gray-600">
                {t.home.features.payment.description}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t.home.features.capacity.title}
              </h3>
              <p className="text-gray-600">
                {t.home.features.capacity.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}