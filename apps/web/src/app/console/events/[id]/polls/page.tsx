import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PollsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Mock polls
  const polls = [
    { 
      id: '1', 
      question: 'What is your favorite part of the event so far?', 
      status: 'Active',
      responses: 142,
      options: [
        { text: 'Keynote Speakers', votes: 65 },
        { text: 'Networking', votes: 42 },
        { text: 'Workshops', votes: 35 }
      ]
    },
    { 
      id: '2', 
      question: 'Where should we host next year?', 
      status: 'Draft',
      responses: 0,
      options: []
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Live Polls</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Live Polls & Q&A</h2>
          <p className="mt-1 text-sm text-slate-500">Engage your audience with real-time feedback.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <button className="ef-btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Poll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-100">
        {polls.map(poll => (
          <div key={poll.id} className="ef-card flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <h3 className="font-semibold text-slate-900 leading-tight pr-4">{poll.question}</h3>
                <p className="text-sm text-slate-500 mt-1">{poll.responses} responses</p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${
                poll.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {poll.status}
              </span>
            </div>
            
            <div className="p-5 flex-1">
              {poll.status === 'Active' && poll.options.length > 0 ? (
                <div className="space-y-4">
                  {poll.options.map((opt, i) => {
                    const percent = Math.round((opt.votes / poll.responses) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700">{opt.text}</span>
                          <span className="text-slate-500">{percent}% ({opt.votes})</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-4">This poll is currently in draft.</p>
                  <button className="ef-btn-secondary text-xs px-4">Edit Options</button>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              {poll.status === 'Active' ? (
                <button className="text-sm text-rose-600 font-medium hover:text-rose-700">Close Poll</button>
              ) : (
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Launch Poll</button>
              )}
              <button className="text-sm text-slate-500 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
