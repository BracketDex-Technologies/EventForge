import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <Link href={`/console/events/${id}/check-ins`} className="hover:text-indigo-600 transition-colors">Check-ins</Link>
            <span>›</span>
            <span className="text-slate-600">Scanner</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">QR Scanner</h2>
          <p className="mt-1 text-sm text-slate-500">Scan attendee tickets for rapid check-in.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-8 animate-fade-in-up delay-100">
        <div className="ef-card p-1">
          <div className="bg-slate-900 rounded-lg aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Mock camera view */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black"></div>
            </div>
            
            {/* Scanner frame */}
            <div className="relative w-64 h-64 border-2 border-indigo-500/50 rounded-2xl flex items-center justify-center">
              {/* Scanning line animation */}
              <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500 shadow-[0_0_10px_2px_rgba(99,102,241,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
              
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl -mt-0.5 -ml-0.5"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl -mt-0.5 -mr-0.5"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl -mb-0.5 -ml-0.5"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl -mb-0.5 -mr-0.5"></div>
            </div>
            
            <p className="text-slate-400 mt-8 font-medium">Position QR code within the frame to scan</p>
          </div>
          
          <div className="p-6 text-center border-t border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Camera Status: Active</h3>
            <p className="text-sm text-slate-500 mb-6">Device: Front Camera</p>
            <button className="ef-btn-secondary px-8">Switch Camera</button>
          </div>
        </div>
      </div>
    </div>
  );
}
