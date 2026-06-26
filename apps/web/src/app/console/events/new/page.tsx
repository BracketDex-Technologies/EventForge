'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    // In a real app we'd post to our NestJS API
    // For now, this is a mock to show the UI
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    
    // Mock save delay
    await new Promise(r => setTimeout(r, 1000));
    
    // Redirect back to events list
    router.push('/console/events');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back navigation & Header */}
      <div>
        <button onClick={() => router.back()} className="text-[12px] font-semibold flex items-center gap-1 mb-2 hover:underline" style={{ color: 'var(--ef-primary)' }}>
          &larr; Back to Events
        </button>
        <h2 className="ef-headline-lg">Create New Event</h2>
        <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
          Configure the core metadata for your new event forge.
        </p>
      </div>

      {/* Form Card */}
      <div className="ef-card p-8 bg-white shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label htmlFor="name" className="ef-label">Event Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              required
              className="ef-input"
              placeholder="e.g. Next-Gen Developer Summit 2026"
            />
          </div>

          {/* Event Type */}
          <div>
            <label htmlFor="type" className="ef-label">Event Type</label>
            <select 
              id="type" 
              name="type" 
              className="ef-input"
              style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="meetup">Meetup</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startsAt" className="ef-label">Start Date & Time</label>
              <input 
                type="datetime-local" 
                name="startsAt" 
                id="startsAt" 
                className="ef-input"
              />
            </div>
            <div>
              <label htmlFor="endsAt" className="ef-label">End Date & Time</label>
              <input 
                type="datetime-local" 
                name="endsAt" 
                id="endsAt" 
                className="ef-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="ef-btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="ef-btn-primary"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
