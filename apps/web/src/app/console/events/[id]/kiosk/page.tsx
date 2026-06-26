import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import KioskTerminal from './KioskTerminal';

export default async function KioskPage({
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
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-hidden flex flex-col justify-between p-8 text-white">
      {/* Background gradients for terminal styling */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Self Check-in Terminal</span>
          <h1 className="text-xl font-bold">{event.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Online
          </div>
          <a
            href={`/console/events/${id}`}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg"
          >
            Exit Terminal
          </a>
        </div>
      </div>

      {/* Interactive Terminal Body */}
      <div className="flex-1 flex items-center justify-center relative z-10 max-w-lg mx-auto w-full">
        <KioskTerminal eventId={id} />
      </div>

      {/* Footer banner */}
      <div className="relative z-10 text-center border-t border-white/5 pt-4 flex justify-between items-center text-xs text-slate-500">
        <p>EventForge Self-Serve Kiosk Mode</p>
        <p>Please have your ticket QR code or 8-digit registration code ready.</p>
      </div>
    </div>
  );
}
