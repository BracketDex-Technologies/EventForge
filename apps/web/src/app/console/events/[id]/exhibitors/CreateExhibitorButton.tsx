'use client';

import { useState } from 'react';
import CreateExhibitorModal from './CreateExhibitorModal';

export default function CreateExhibitorButton({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="ef-btn-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Exhibitor
      </button>
      <CreateExhibitorModal eventId={eventId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
