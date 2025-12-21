'use client';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { t } from '@/lib/translations';
import { Session } from 'next-auth';

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Academia
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                {t.nav.home}
              </Link>
              <Link href="/servicios" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                {t.nav.services}
              </Link>
              <Link href="/precios" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                {t.nav.pricing}
              </Link>
              <Link href="/clases" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                {t.nav.classes}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                  {t.nav.dashboard}
                </Link>
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                    {t.nav.admin}
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}