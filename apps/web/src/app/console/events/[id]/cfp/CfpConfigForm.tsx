'use client';

import { useState, useTransition } from 'react';
import { saveCfpConfig } from './actions';

interface CfpConfigFormProps {
  eventId: string;
  initialConfig: {
    status: string;
    opensAt: string;
    closesAt: string;
    guidelines: string;
    maxSubmissions: number;
    blindReview: boolean;
    reviewCriteria: any[];
  };
}

export default function CfpConfigForm({ eventId, initialConfig }: CfpConfigFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialConfig.status);
  const [opensAt, setOpensAt] = useState(initialConfig.opensAt);
  const [closesAt, setClosesAt] = useState(initialConfig.closesAt);
  const [guidelines, setGuidelines] = useState(initialConfig.guidelines);
  const [maxSubmissions, setMaxSubmissions] = useState(initialConfig.maxSubmissions);
  const [blindReview, setBlindReview] = useState(initialConfig.blindReview);
  
  // Criteria management
  const [criteria, setCriteria] = useState<any[]>(initialConfig.reviewCriteria);
  const [newLabel, setNewLabel] = useState('');

  const addCriterion = () => {
    if (!newLabel.trim()) return;
    const newId = newLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    setCriteria([...criteria, { id: newId, label: newLabel, maxScore: 5 }]);
    setNewLabel('');
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveCfpConfig(eventId, {
        status,
        opensAt: opensAt || null,
        closesAt: closesAt || null,
        guidelines: guidelines || null,
        maxSubmissions,
        blindReview,
        reviewCriteria: criteria,
      });

      if (res.success) {
        alert('CFP configuration updated successfully!');
      } else {
        alert(res.error || 'Failed to update CFP configuration.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">CFP Status</label>
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)} 
          className="ef-input text-xs"
        >
          <option value="draft">Draft (Closed)</option>
          <option value="open">Open (Accepting Submissions)</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Opens At</label>
          <input 
            type="date" 
            value={opensAt} 
            onChange={e => setOpensAt(e.target.value)} 
            className="ef-input text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Closes At</label>
          <input 
            type="date" 
            value={closesAt} 
            onChange={e => setClosesAt(e.target.value)} 
            className="ef-input text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Max Submissions per Speaker</label>
        <input 
          type="number" 
          value={maxSubmissions} 
          onChange={e => setMaxSubmissions(parseInt(e.target.value) || 1)} 
          className="ef-input text-xs"
          min="1"
        />
      </div>

      <div className="flex items-center gap-2 py-1">
        <input 
          type="checkbox" 
          id="blindReview"
          checked={blindReview} 
          onChange={e => setBlindReview(e.target.checked)} 
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="blindReview" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
          Enable Blind Review (hide author info from reviewers)
        </label>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Guidelines for Submitters</label>
        <textarea 
          value={guidelines} 
          onChange={e => setGuidelines(e.target.value)} 
          placeholder="Enter guidelines, instructions, session tracks, etc."
          className="ef-input text-xs min-h-[80px]"
        />
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-3">
        <label className="text-xs font-bold text-slate-700 block">Review Criteria</label>
        
        {criteria.length === 0 ? (
          <p className="text-[11px] text-slate-400">No scoring criteria added. Add at least one.</p>
        ) : (
          <div className="space-y-1.5">
            {criteria.map((c) => (
              <div key={c.id} className="flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700">{c.label} (Max: {c.maxScore})</span>
                <button 
                  type="button" 
                  onClick={() => removeCriterion(c.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Add new criteria (e.g. Structure)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            className="ef-input text-xs py-1"
          />
          <button 
            type="button" 
            onClick={addCriterion}
            className="ef-btn-secondary py-1 px-3 text-xs"
          >
            Add
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="ef-btn-primary w-full py-2 text-xs font-bold mt-2"
      >
        {isPending ? 'Saving...' : 'Save Configuration'}
      </button>
    </form>
  );
}
