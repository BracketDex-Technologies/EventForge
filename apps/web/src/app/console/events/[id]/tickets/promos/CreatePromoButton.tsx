'use client';

import { useState } from 'react';
import CreatePromoModal from './CreatePromoModal';

export default function CreatePromoButton({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="ef-btn-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Promo Code
      </button>
      <CreatePromoModal eventId={eventId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
