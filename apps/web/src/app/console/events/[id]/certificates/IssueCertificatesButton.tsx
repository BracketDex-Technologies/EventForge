'use client';

import { useTransition } from 'react';
import { issueCertificates } from './actions';

interface IssueCertificatesButtonProps {
  eventId: string;
  templateId: string;
}

export default function IssueCertificatesButton({ eventId, templateId }: IssueCertificatesButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleIssue = () => {
    if (!confirm('Are you sure you want to bulk-issue certificates to all ticket holders? This will generate unique verification codes for attendees.')) {
      return;
    }
    
    startTransition(async () => {
      const res = await issueCertificates(eventId, templateId);
      if (res.success) {
        alert(`Success! Generated certificates for ${res.issuedCount} new attendees.`);
      } else {
        alert(res.error || 'Failed to issue certificates.');
      }
    });
  };

  return (
    <button
      onClick={handleIssue}
      disabled={isPending}
      className="ef-btn-primary px-4 py-2 text-xs font-bold"
    >
      {isPending ? 'Generating...' : '🎓 Issue to All Attendees'}
    </button>
  );
}
