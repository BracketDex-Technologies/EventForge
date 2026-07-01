'use client';

import { useEffect, useState } from 'react';
import { Eye, PanelTop, Type } from 'lucide-react';
import type React from 'react';

type AccessibilityMode = {
  highContrast: boolean;
  largeText: boolean;
  readingGuide: boolean;
};

const defaultMode: AccessibilityMode = {
  highContrast: false,
  largeText: false,
  readingGuide: false,
};

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AccessibilityMode>(defaultMode);

  useEffect(() => {
    const savedMode = window.localStorage.getItem('eventforge-accessibility');
    if (!savedMode) {
      return;
    }

    try {
      setMode({ ...defaultMode, ...JSON.parse(savedMode) });
    } catch {
      window.localStorage.removeItem('eventforge-accessibility');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.efHighContrast = String(mode.highContrast);
    root.dataset.efLargeText = String(mode.largeText);
    root.dataset.efReadingGuide = String(mode.readingGuide);
    window.localStorage.setItem('eventforge-accessibility', JSON.stringify(mode));
  }, [mode]);

  return (
    <div className="fixed bottom-20 left-5 z-[70]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="Accessibility controls"
        title="Accessibility controls"
        onClick={() => setIsOpen(value => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-lg transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Eye className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="mt-3 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Accessibility
          </p>
          <div className="space-y-2">
            <ToggleButton
              isActive={mode.highContrast}
              icon={<Eye className="h-4 w-4" />}
              label="High contrast"
              onClick={() => setMode(value => ({ ...value, highContrast: !value.highContrast }))}
            />
            <ToggleButton
              isActive={mode.largeText}
              icon={<Type className="h-4 w-4" />}
              label="Large text"
              onClick={() => setMode(value => ({ ...value, largeText: !value.largeText }))}
            />
            <ToggleButton
              isActive={mode.readingGuide}
              icon={<PanelTop className="h-4 w-4" />}
              label="Reading guide"
              onClick={() => setMode(value => ({ ...value, readingGuide: !value.readingGuide }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleButton({
  icon,
  isActive,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-semibold transition ${
        isActive
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-xs">{isActive ? 'On' : 'Off'}</span>
    </button>
  );
}
