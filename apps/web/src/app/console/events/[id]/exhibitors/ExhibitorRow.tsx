'use client';

import { useTransition } from 'react';
import { deleteExhibitor } from './actions';

interface ExhibitorRowProps {
  eventId: string;
  exhibitor: {
    id: string;
    name: string;
    tier: string;
    description: string | null;
    logoUrl: string | null;
    boothNumber: string | null;
    contactEmail: string | null;
    website: string | null;
    leadsCaptured: number;
  };
}

export default function ExhibitorRow({ eventId, exhibitor }: ExhibitorRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to remove this exhibitor?')) return;
    startTransition(async () => {
      const res = await deleteExhibitor(exhibitor.id, eventId);
      if (!res.success) alert(res.error);
    });
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Platinum
          </span>
        );
      case 'gold':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Gold
          </span>
        );
      case 'silver':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Silver
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
            Standard
          </span>
        );
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-4 px-6 font-medium text-slate-900">
        <div className="flex items-center gap-3">
          {exhibitor.logoUrl ? (
            <img
              src={exhibitor.logoUrl}
              alt={exhibitor.name}
              className="w-8 h-8 rounded bg-slate-50 object-contain border border-slate-100"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
              {exhibitor.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-800">{exhibitor.name}</div>
            {exhibitor.website && (
              <a
                href={exhibitor.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-500 hover:underline"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-6">{getTierBadge(exhibitor.tier)}</td>
      <td className="py-4 px-6 text-sm text-slate-600 font-mono">
        {exhibitor.boothNumber || '-'}
      </td>
      <td className="py-4 px-6 text-sm text-slate-600">
        {exhibitor.contactEmail || '-'}
      </td>
      <td className="py-4 px-6 text-sm text-slate-600 font-semibold">
        {exhibitor.leadsCaptured}
      </td>
      <td className="py-4 px-6 text-right">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-rose-600 hover:text-rose-900 text-sm font-medium disabled:opacity-50"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
