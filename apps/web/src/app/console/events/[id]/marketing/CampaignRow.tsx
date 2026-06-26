'use client';

import { useTransition } from 'react';
import { updateCampaignStatus, deleteCampaign } from './actions';

interface CampaignRowProps {
  eventId: string;
  campaign: {
    id: string;
    name: string;
    subject: any;
    status: string;
    sentAt: Date | null;
    scheduledAt: Date | null;
    recipientCount: number;
    openCount: number;
    clickCount: number;
  };
}

export default function CampaignRow({ eventId, campaign }: CampaignRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    if (!confirm('Are you sure you want to send this campaign now?')) return;
    startTransition(async () => {
      const res = await updateCampaignStatus(campaign.id, eventId, 'sent');
      if (!res.success) alert(res.error);
    });
  };

  const handleCancelScheduled = () => {
    startTransition(async () => {
      const res = await updateCampaignStatus(campaign.id, eventId, 'draft');
      if (!res.success) alert(res.error);
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    startTransition(async () => {
      const res = await deleteCampaign(campaign.id, eventId);
      if (!res.success) alert(res.error);
    });
  };

  const subjectText = campaign.subject?.en || campaign.subject || '';
  const openRate = campaign.recipientCount > 0 ? ((campaign.openCount / campaign.recipientCount) * 100).toFixed(1) + '%' : '-';
  const clickRate = campaign.recipientCount > 0 ? ((campaign.clickCount / campaign.recipientCount) * 100).toFixed(1) + '%' : '-';

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-4 px-6 font-medium text-slate-900">
        <div>{campaign.name}</div>
        <div className="text-xs text-slate-500 font-normal mt-0.5">{subjectText}</div>
      </td>
      <td className="py-4 px-6">
        {campaign.status === 'sent' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Sent
          </span>
        )}
        {campaign.status === 'sending' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 animate-pulse">
            Sending
          </span>
        )}
        {campaign.status === 'scheduled' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Scheduled
          </span>
        )}
        {campaign.status === 'draft' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        )}
      </td>
      <td className="py-4 px-6 text-sm text-slate-600">
        {campaign.status === 'sent' && campaign.sentAt ? (
          new Date(campaign.sentAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        ) : campaign.status === 'scheduled' && campaign.scheduledAt ? (
          <div>
            <div className="text-xs text-slate-400">Scheduled for</div>
            <div>
              {new Date(campaign.scheduledAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="py-4 px-6 text-sm text-slate-600">{openRate}</td>
      <td className="py-4 px-6 text-sm text-slate-600">{clickRate}</td>
      <td className="py-4 px-6 text-right space-x-2">
        {campaign.status === 'draft' && (
          <button
            onClick={handleSend}
            disabled={isPending}
            className="text-emerald-600 hover:text-emerald-900 text-sm font-medium disabled:opacity-50"
          >
            Send Now
          </button>
        )}
        {campaign.status === 'scheduled' && (
          <button
            onClick={handleCancelScheduled}
            disabled={isPending}
            className="text-amber-600 hover:text-amber-900 text-sm font-medium disabled:opacity-50"
          >
            Cancel Send
          </button>
        )}
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
