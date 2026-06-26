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
    <nav className="flex gap-2 -mb-px overflow-x-auto py-1">
      {tabs.map((tab) => {
        const fullPath = `${basePath}${tab.href}`;
        // Match exact or prefix for subroutes (e.g. agenda details)
        const isActive = tab.href === '' 
          ? pathname === basePath 
          : pathname.startsWith(fullPath);

        return (
          <Link
            key={tab.href}
            href={fullPath}
            className="px-4 py-2.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap"
            style={{
              background: isActive ? 'var(--ef-primary-gradient)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--ef-text-secondary)',
              boxShadow: isActive ? 'var(--ef-shadow-sm)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--ef-surface-container)';
                e.currentTarget.style.color = 'var(--ef-text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--ef-text-secondary)';
              }
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
