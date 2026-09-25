import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">404</p>
      <h1 className="font-serif text-4xl text-navy-900">Page not found</h1>
      <p className="text-gray-600">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-navy-600 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-500"
      >
        Back to home
      </Link>
    </main>
  );
}
