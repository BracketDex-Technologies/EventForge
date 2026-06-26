'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    // Mock save delay
    await new Promise(r => setTimeout(r, 1000));
    
    router.push('/console/events');
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <button 
          onClick={() => router.back()} 
          className="text-xs font-semibold flex items-center gap-1 mb-2 text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          &larr; Back to Events
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Event</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure the core metadata for your new event.
        </p>
      </div>

      <div className="ef-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="ef-btn-primary disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
