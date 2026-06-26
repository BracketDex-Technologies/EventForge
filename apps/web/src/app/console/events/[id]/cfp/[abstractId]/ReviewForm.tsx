'use client';

import { useState, useTransition } from 'react';
import { submitAbstractReview } from '../actions';

interface ReviewFormProps {
  eventId: string;
  abstractId: string;
  criteria: any[];
  initialReview?: {
    scores: Record<string, number>;
    comment: string;
    recommend: string;
  };
}

export default function ReviewForm({ eventId, abstractId, criteria, initialReview }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (initialReview?.scores) return initialReview.scores;
    const defaultScores: Record<string, number> = {};
    criteria.forEach(c => {
      defaultScores[c.id] = 3; // start in the middle (3/5)
    });
    return defaultScores;
  });
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [recommend, setRecommend] = useState(initialReview?.recommend || 'neutral');

  const handleScoreChange = (criteriaId: string, val: number) => {
    setScores({ ...scores, [criteriaId]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitAbstractReview(eventId, abstractId, {
        scores,
        comment: comment || null,
        recommend,
      });

      if (res.success) {
        alert('Review submitted successfully!');
      } else {
        alert(res.error || 'Failed to submit review.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {criteria.map((c) => {
        const currentScore = scores[c.id] || 3;
        return (
          <div key={c.id} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">{c.label}</label>
              <span className="text-xs font-bold text-indigo-600">{currentScore} / {c.maxScore}</span>
            </div>
            <input
              type="range"
              min="1"
              max={c.maxScore}
              value={currentScore}
              onChange={(e) => handleScoreChange(c.id, parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        );
      })}

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Recommendation</label>
        <select
          value={recommend}
          onChange={(e) => setRecommend(e.target.value)}
          className="ef-input text-xs"
        >
          <option value="accept">Strongly Recommend Accept</option>
          <option value="neutral">Neutral / Discuss</option>
          <option value="reject">Strongly Recommend Reject</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Reviewer Notes (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share constructive feedback or internal organizer thoughts..."
          className="ef-input text-xs min-h-[70px]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="ef-btn-primary w-full py-2 text-xs font-bold"
      >
        {isPending ? 'Submitting...' : initialReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}
