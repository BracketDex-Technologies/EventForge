'use client';

import { useTransition } from 'react';
import { deletePromoCode } from './actions';

interface PromoRowProps {
  eventId: string;
  promo: {
    id: string;
    code: string;
    kind: string;
    value: any; // Decimal type from Prisma
    maxUses: number;
    uses: number;
    validFrom: Date | null;
    validTo: Date | null;
  };
}

export default function PromoRow({ eventId, promo }: PromoRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete promo code ${promo.code}?`)) return;
    startTransition(async () => {
      const res = await deletePromoCode(promo.id, eventId);
      if (!res.success) alert(res.error);
    });
  };

  const displayDiscount = promo.kind === 'percent' ? `${Number(promo.value)}%` : `$${Number(promo.value).toFixed(2)}`;

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-4 px-6 font-mono font-bold tracking-wider text-indigo-600">
        {promo.code}
      </td>
      <td className="py-4 px-6 font-medium text-slate-800">
        {displayDiscount} Off
      </td>
      <td className="py-4 px-6 text-sm text-slate-600">
        {promo.uses} / {promo.maxUses === 0 ? '∞' : promo.maxUses}
      </td>
      <td className="py-4 px-6 text-sm text-slate-500">
        {promo.validFrom ? new Date(promo.validFrom).toLocaleDateString() : 'Immediate'}
      </td>
      <td className="py-4 px-6 text-sm text-slate-500">
        {promo.validTo ? new Date(promo.validTo).toLocaleDateString() : 'Never'}
      </td>
      <td className="py-4 px-6 text-right">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-rose-600 hover:text-rose-900 text-sm font-medium disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
