'use client';

import { useState, useTransition } from 'react';
import { submitPollVote, submitQaMessage, upvoteQaMessage } from './actions';

interface PollOption {
  id: string;
  text: string;
}

interface PollVote {
  id: string;
  optionId: string;
  attendeeId: string;
}

interface Poll {
  id: string;
  question: any;
  options: any; // PollOption[]
  votes: PollVote[];
}

interface QaMessage {
  id: string;
  text: string;
  votes: number;
  isAnonymous: boolean;
  createdAt: string;
  attendee?: {
    displayName: string;
  };
}

interface Session {
  id: string;
  title: any;
  polls: Poll[];
  qaMessages: QaMessage[];
}

interface LiveEngagementProps {
  eventId: string;
  sessions: Session[];
  currentAttendeeId: string | null;
}

function getInitialSessionId(sessions: Session[]) {
  return sessions.find(session => session.polls.length > 0 || session.qaMessages.length > 0)?.id || sessions[0]?.id || '';
}

export default function LiveEngagement({ eventId, sessions, currentAttendeeId }: LiveEngagementProps) {
  const [activeSessionId, setActiveSessionId] = useState<string>(() => getInitialSessionId(sessions));
  const [activeTab, setActiveTab] = useState<'polls' | 'qa'>('polls');
  const [isPending, startTransition] = useTransition();

  // Q&A inputs
  const [newQuestion, setNewQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleVote = (pollId: string, optionId: string) => {
    if (!currentAttendeeId) {
      alert('Please sign in to vote in live polls!');
      return;
    }

    startTransition(async () => {
      const res = await submitPollVote(eventId, pollId, optionId);
      if (!res.success) {
        alert(res.error || 'Failed to submit vote.');
      }
    });
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !activeSessionId) return;

    if (!currentAttendeeId) {
      alert('Please sign in to submit a question.');
      return;
    }

    startTransition(async () => {
      const res = await submitQaMessage(eventId, activeSessionId, newQuestion, isAnonymous);
      if (res.success) {
        setNewQuestion('');
        setIsAnonymous(false);
      } else {
        alert(res.error || 'Failed to submit question.');
      }
    });
  };

  const handleUpvote = (qaId: string) => {
    startTransition(async () => {
      const res = await upvoteQaMessage(eventId, qaId);
      if (!res.success) {
        alert(res.error || 'Failed to upvote.');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Session Select sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="ef-card p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sessions with Live Board</h3>
          <div className="space-y-2">
            {sessions.map(s => {
              const isActive = s.id === activeSessionId;
              const titleText = typeof s.title === 'string' ? s.title : s.title?.en || 'Untitled Session';
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer block ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🎙️ {titleText}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Engagement View */}
      <div className="lg:col-span-8 space-y-6">
        {activeSession ? (
          <div className="ef-card overflow-hidden">
            {/* Header / Tabs */}
            <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 gap-4">
              <h2 className="text-sm font-bold text-white tracking-tight leading-snug">
                {typeof activeSession.title === 'string' ? activeSession.title : activeSession.title?.en || 'Untitled Session'}
              </h2>

              <div className="flex bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('polls')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'polls' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🗳️ Live Polls ({activeSession.polls.length})
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'qa' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💬 Q&A ({activeSession.qaMessages.length})
                </button>
              </div>
            </div>

            {/* TAB PANELS */}
            <div className="p-6">
              {/* POLLS TAB */}
              {activeTab === 'polls' && (
                <div className="space-y-6">
                  {activeSession.polls.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No active polls in this session.
                    </div>
                  ) : (
                    activeSession.polls.map(poll => {
                      const totalVotes = poll.votes.length;
                      const hasVoted = poll.votes.some(v => v.attendeeId === currentAttendeeId);
                      const myVote = poll.votes.find(v => v.attendeeId === currentAttendeeId);
                      const questionText = typeof poll.question === 'string' ? poll.question : poll.question?.en || 'Untitled Poll';

                      // Parse Options
                      const optionsList: PollOption[] = typeof poll.options === 'string' 
                        ? JSON.parse(poll.options) 
                        : (poll.options as any) || [];

                      return (
                        <div key={poll.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                          <h4 className="font-bold text-sm text-slate-900">{questionText}</h4>

                          <div className="space-y-3">
                            {optionsList.map(opt => {
                              const voteCount = poll.votes.filter(v => v.optionId === opt.id).length;
                              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                              const isMyChoice = myVote?.optionId === opt.id;

                              if (hasVoted) {
                                // Show results view with progress bars
                                return (
                                  <div key={opt.id} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                      <span className="text-slate-800 flex items-center gap-1.5">
                                        {opt.text}
                                        {isMyChoice && (
                                          <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                            My Vote
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-slate-500">{percentage}% ({voteCount})</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          isMyChoice ? 'bg-indigo-600' : 'bg-slate-400'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              } else {
                                // Interactive voting buttons
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleVote(poll.id, opt.id)}
                                    disabled={isPending}
                                    className="w-full text-left text-xs font-bold px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/20 active:bg-indigo-50 transition-all block cursor-pointer disabled:opacity-60"
                                  >
                                    {opt.text}
                                  </button>
                                );
                              }
                            })}
                          </div>

                          {hasVoted && (
                            <p className="text-[10px] text-slate-400 font-medium pt-2 flex justify-between">
                              <span>Total votes: {totalVotes}</span>
                              <span className="italic">Clicking options is locked after voting.</span>
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Q&A TAB */}
              {activeTab === 'qa' && (
                <div className="space-y-6">
                  {/* Submit Form */}
                  <form onSubmit={handleAskQuestion} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 block">Ask a Question</label>
                      <textarea
                        required
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        placeholder="Type your question for the speaker..."
                        className="ef-input text-xs min-h-[60px]"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={e => setIsAnonymous(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        Ask Anonymously
                      </label>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="ef-btn-primary px-5 py-2 text-xs font-bold"
                      >
                        {isPending ? 'Submitting...' : 'Post Question'}
                      </button>
                    </div>
                  </form>

                  {/* Q&A List */}
                  <div className="space-y-3">
                    {activeSession.qaMessages.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No questions asked yet. Be the first to ask!
                      </div>
                    ) : (
                      activeSession.qaMessages.map(msg => (
                        <div key={msg.id} className="ef-card p-4 border border-slate-100 flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {msg.text}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                              <span>
                                Asked by {msg.isAnonymous ? 'Anonymous' : msg.attendee?.displayName || 'Attendee'}
                              </span>
                              <span>•</span>
                              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleUpvote(msg.id)}
                            className="flex items-center gap-1.5 border border-slate-200 hover:border-indigo-600 bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/20 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            ▲ {msg.votes}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ef-card p-16 text-center bg-white shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs">No active sessions found for live engagement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
