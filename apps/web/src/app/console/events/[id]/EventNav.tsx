'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  label: string;
  href: string;
}

export default function EventNav({
  tabs,
  basePath,
}: {
  tabs: Tab[];
  basePath: string;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 -mb-px overflow-x-auto py-1">
      {tabs.map((tab) => {
        const fullPath = `${basePath}${tab.href}`;
        const isActive = tab.href === '' 
          ? pathname === basePath 
          : pathname.startsWith(fullPath);

        return (
          <Link
            key={tab.href}
            href={fullPath}
            className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
