'use client';

import { useState } from 'react';
import CreateTicketModal from './CreateTicketModal';

export default function CreateTicketButton({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="ef-btn-primary py-2 text-sm"
      >
        + Create Ticket Tier
      </button>

      <CreateTicketModal 
        eventId={eventId} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
