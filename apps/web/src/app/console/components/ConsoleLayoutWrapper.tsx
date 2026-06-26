'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import Link from 'next/link';
import Image from 'next/image';

export function ConsoleLayoutWrapper({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 z-40">
        <Link href="/console" className="inline-flex items-center gap-2.5">
          <Image src="/logo-icon.svg" alt="EventForge" width={28} height={28} />
          <span className="font-bold text-base tracking-tight text-slate-900">EventForge</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-none transition-colors"
          aria-label="Open navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar userEmail={userEmail} isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Main Content Viewport */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0 flex flex-col">
        <div className="flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
