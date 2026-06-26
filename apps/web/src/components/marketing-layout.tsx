'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Theme Context ──
interface ThemeCtx {
  isDark: boolean;
  toggleTheme: () => void;
  bgClass: string;
  borderClass: string;
  navTextClass: string;
  cardBgClass: string;
  textPrimaryClass: string;
  textMutedClass: string;
  textLabelsClass: string;
}

const ThemeContext = createContext<ThemeCtx | null>(null);
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside MarketingLayout');
  return ctx;
};

// ── Nav Links ──
const navLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/support', label: 'Support' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ef-theme');
    if (saved === 'light' || saved === 'dark') {
      setTimeout(() => setTheme(saved), 0);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('ef-theme', next);
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#0c0d12] text-slate-100' : 'bg-[#FAF9F6] text-slate-800';
  const borderClass = isDark ? 'border-slate-900/60' : 'border-slate-200/80';
  const navTextClass = isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const cardBgClass = isDark ? 'bg-slate-900/30 border-slate-900/60' : 'bg-white border-slate-200/80 shadow-sm';
  const textPrimaryClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const textLabelsClass = isDark ? 'text-slate-300' : 'text-slate-700';

  const ctx: ThemeCtx = {
    isDark, toggleTheme, bgClass, borderClass, navTextClass,
    cardBgClass, textPrimaryClass, textMutedClass, textLabelsClass,
  };

  return (
    <ThemeContext.Provider value={ctx}>
      <div className={`min-h-screen flex flex-col overflow-x-hidden font-sans transition-colors duration-300 ${bgClass}`}>

        {/* Glow Effects */}
        <div className={`fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] bg-indigo-500 pointer-events-none transition-opacity ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`} />
        <div className={`fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] bg-teal-500 pointer-events-none transition-opacity ${isDark ? 'opacity-[0.05]' : 'opacity-[0.02]'}`} />

        {/* Navigation Header */}
        <header className={`w-full h-20 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${borderClass} ${isDark ? 'bg-[#0c0d12]/90' : 'bg-[#FAF9F6]/90'}`}>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className={`p-1 rounded-xl bg-slate-900 ${isDark ? 'border border-slate-800' : 'border border-slate-200 shadow-sm'}`}>
              <Image src="/logo-icon.svg" alt="EventForge" width={28} height={28} />
            </div>
            <span className={`font-bold text-lg tracking-tight ${textPrimaryClass}`}>EventForge</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`transition-colors ${navTextClass}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-950 shadow-sm'
              }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.96-8.96h-2.25M4.29 12h-2.25m15.364-6.364l-1.591 1.591M6.364 17.636l-1.591 1.591m12.728 0l-1.591-1.591M6.364 6.364L4.773 4.773M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border transition-all ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>

            <Link href="/login" className={`hidden md:inline-block text-sm font-bold transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}>
              Sign in
            </Link>
            <Link href="/login" className="hidden md:inline-block py-2.5 px-4.5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#ff966c] transition-colors shadow-lg shadow-[#FF8552]/10">
              Get Started
            </Link>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b px-6 py-4 space-y-3 backdrop-blur-md transition-colors ${borderClass} ${isDark ? 'bg-[#0c0d12]/95' : 'bg-[#FAF9F6]/95'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-semibold py-2 transition-colors ${navTextClass}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className={`text-sm font-bold transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Sign in
              </Link>
              <Link href="/login" className="py-2 px-4 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-xs uppercase tracking-wider">
                Get Started
              </Link>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className={`border-t bg-slate-950 py-12 px-6 lg:px-12 transition-colors ${borderClass}`}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              {/* Brand Column */}
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2.5">
                  <Image src="/logo-icon.svg" alt="EventForge" width={24} height={24} />
                  <span className="font-bold text-white text-sm">EventForge</span>
                </Link>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The complete event management platform. Plan, ticket, engage, and analyze — all in one place.
                </p>
              </div>

              {/* Product Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/features" className="text-xs text-slate-500 hover:text-white transition-colors">Features</Link>
                  <Link href="/pricing" className="text-xs text-slate-500 hover:text-white transition-colors">Pricing</Link>
                  <Link href="/how-it-works" className="text-xs text-slate-500 hover:text-white transition-colors">How It Works</Link>
                  <Link href="/support" className="text-xs text-slate-500 hover:text-white transition-colors">Support</Link>
                </div>
              </div>

              {/* Company Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/about" className="text-xs text-slate-500 hover:text-white transition-colors">About Us</Link>
                  <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
                </div>
              </div>

              {/* Console Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Console</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="text-xs text-slate-500 hover:text-white transition-colors">Sign In</Link>
                  <Link href="/console" className="text-xs text-slate-500 hover:text-white transition-colors">Dashboard</Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-slate-600">
                © {new Date().getFullYear()} EventForge. All rights reserved.
              </p>
              <div className="flex gap-6 text-xs text-slate-500">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}
