'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Icon } from '@/components/Icon';

const adminNavLinks = [
  { href: '/admin/contact-messages', label: 'Contact Messages', icon: 'mail' },
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/announcements', label: 'Announcements', icon: 'campaign' },
  { href: '/admin/sermons', label: 'Sermons', icon: 'menu_book' },
  { href: '/admin/events', label: 'Events', icon: 'event' },
  { href: '/admin/facebook-sources', label: 'News Sources', icon: 'share' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { member, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-navy-500">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-warm-white">
      {/* Mobile top navigation */}
      <header className="md:hidden bg-gradient-navy text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-navy-900 font-bold text-xs">PC</span>
          </div>
          <span className="font-bold text-lg truncate">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-navy-800 text-white px-4 py-3" aria-label="Admin mobile navigation">
          <div className="py-2 px-3 text-white/60 text-sm truncate">
            {member?.name} (Admin)
          </div>
          <ul className="space-y-1 mt-1">
            {adminNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive(link.href)
                      ? 'bg-gold-400/20 text-gold-300 font-medium'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon name={link.icon} className="text-[20px]" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:bg-white/5 transition-all"
          >
            <Icon name="public" className="text-[20px]" />
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="mt-1 w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:bg-white/5 transition-all"
          >
            <Icon name="logout" className="text-[20px]" />
            Logout
          </button>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-navy-900 text-white min-h-screen shadow-xl" aria-label="Admin sidebar navigation">
        <div className="px-6 py-5 bg-gradient-navy border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow">
              <span className="text-navy-900 font-bold text-sm">PC</span>
            </div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
          </div>
          <p className="text-white/50 text-sm mt-1 truncate">{member?.name}</p>
        </div>

        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {adminNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-gold-400/15 text-gold-300 font-medium shadow-sm'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon name={link.icon} className="text-[20px]" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all mb-1 text-white/70"
          >
            <Icon name="public" className="text-[20px]" />
            <span className="text-sm">View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
          >
            <Icon name="logout" className="text-[20px]" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 bg-warm-white min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
