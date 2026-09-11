'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { useNotifications } from '@/providers/NotificationProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/events', label: 'Events' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/news', label: 'News' },
  { href: '/games', label: 'Games' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(104);
  const pathname = usePathname();
  const { showPushPrompt, acceptPush, declinePush } = useNotifications();

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      setHeaderHeight(header.getBoundingClientRect().height);
    };
    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
      >
        {/* Top announcement bar */}
        <div className="bg-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs tracking-wide">
            <div className="flex items-center gap-2 overflow-hidden">
              <Icon name="campaign" className="text-gold-300 text-[16px]" />
              <span className="truncate">
                Join us this Sunday: 1st Service 7:00 AM | 2nd Service 9:30 AM
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <span className="text-gold-300 font-semibold">Motto:</span>
              <span className="italic">Pacesetters</span>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div
          className={`transition-colors duration-300 ${
            scrolled ? 'glass-dark' : 'bg-gradient-navy'
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 py-3 gap-4">
              {/* Logo / Church Name */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
                  <img className="rounded-full" src="/pcc-logo.png" alt="PCC Logo" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold tracking-wide text-white">
                    Presbyterian Church In Cameroon
                  </span>
                  <span className="hidden sm:block text-[11px] uppercase font-semibold tracking-wider text-gold-300">
                    Kumba-Mbeng Congregation
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pathname === link.href
                        ? 'bg-white/15 text-gold-300 shadow-sm'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Right-side actions */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <Link
                  href="/sermons"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Watch Live
                </Link>
                {/* <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-700 text-white text-sm font-semibold hover:bg-navy-600 transition-colors"
                >
                  <Icon name="person" className="text-[18px]" />
                  Admin Login
                </Link> */}
              </div>

              {/* Hamburger Button (mobile) */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-300 min-w-[44px] min-h-[44px] transition-colors duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                menuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-1 pt-2 border-t border-white/10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium min-h-[44px] flex items-center transition-all duration-200 ${
                      pathname === link.href
                        ? 'bg-white/15 text-gold-300'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-semibold min-h-[44px] flex items-center gap-2 bg-navy-700 text-white mt-2"
                >
                  <Icon name="person" className="text-[18px]" />
                  Admin Login
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Match the fixed header as fonts, viewport, and mobile menu change. */}
      <div aria-hidden="true" className="shrink-0" style={{ height: headerHeight }} />

      {/* Anonymous push opt-in banner */}
      {showPushPrompt && (
        <div className="bg-navy-50 border-b border-gold-200/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon name="notifications" className="text-navy-700 text-[22px]" />
            <p className="text-sm text-navy-800 font-medium">
              Get notified about new announcements, events, and sermons.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={acceptPush}
              className="min-h-[44px] px-5 py-2 bg-gradient-gold text-navy-900 text-sm font-bold rounded-xl hover:shadow-glow transition-all"
            >
              Enable
            </button>
            <button
              onClick={declinePush}
              className="min-h-[44px] px-5 py-2 text-navy-600 text-sm font-medium rounded-xl hover:bg-navy-100 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Church Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                  <img className="rounded-full" src="/pcc-logo.png" alt="PCC Logo" />
                </div>
                <h3 className="text-lg font-bold">PC Kumba-Mbeng</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                A Christ-centered community rooted in Reformed heritage, dedicated to
                worship, discipleship, and service in Kumba-Mbeng.
              </p>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="block text-[11px] uppercase font-bold tracking-wider text-gold-300">
                  Our Sacred Motto
                </span>
                <p className="italic text-white/90 mt-1">Pacesetters</p>
                <span className="text-xs text-white/50">The Burning Bush — Unconsumed</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {/* <li>
                  <Link
                    href="/login"
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                  >
                    Admin Login
                  </Link>
                </li> */}
              </ul>
            </div>

            {/* Service Times */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300 mb-4">
                Service Times
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex justify-between gap-2">
                  <span>1st Service</span>
                  <span className="text-white">7:00 AM</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>2nd Service</span>
                  <span className="text-white">9:30 AM</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Bible Study (Thurs)</span>
                  <span className="text-white">5:00 PM</span>
                </li>
                {/* <li className="flex justify-between gap-2">
                  <span>Prayers (Fri)</span>
                  <span className="text-white">4:30 PM</span>
                </li> */}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300 mb-4">
                Congregation Secretariat
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Icon name="location_on" className="text-gold-300 text-[18px] shrink-0" />
                  <span>Kumba-Mbeng Congregation, Meme Division, South West Region, Cameroon</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="mail" className="text-gold-300 text-[18px] shrink-0" />
                  <span>info@pckumbambeng.org</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="call" className="text-gold-300 text-[18px] shrink-0" />
                  <span>+237 233 XX XX XX</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/50">
              &copy; {new Date().getFullYear()} Presbyterian Church in Cameroon — Kumba-Mbeng
              Congregation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
