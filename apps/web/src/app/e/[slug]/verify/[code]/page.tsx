import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ slug: string; code: string }>;
}) {
  const { slug, code } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: code },
    include: {
      template: true,
      event: true,
    },
  });

  if (!certificate || certificate.eventId !== slug) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full mx-auto bg-rose-50 text-rose-500 flex items-center justify-center text-3xl">
          ✕
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
        <p className="text-sm text-slate-500">
          The certificate verification code <code className="font-bold text-slate-700 bg-slate-100 px-1 rounded">{code}</code> is invalid or has been revoked.
        </p>
        <Link
          href={`/e/${slug}`}
          className="ef-btn-secondary px-4 py-2 text-xs font-semibold inline-block"
        >
          Back to Event Home
        </Link>
      </div>
    );
  }

  const { template, event } = certificate;
  const layout = (template.layout as any) || {};

  // Certificate Style Classes
  const getStyleClasses = () => {
    switch (template.style) {
      case 'modern':
        return {
          container: 'border-[16px] border-double border-indigo-600 bg-indigo-50/10 p-8 md:p-12 text-center rounded-lg shadow-inner',
          title: 'font-sans font-black text-indigo-700 tracking-wider uppercase text-2xl md:text-4xl',
          subtitle: 'font-sans text-xs md:text-sm text-slate-400 italic tracking-wider mt-2',
          name: 'font-sans font-bold text-slate-800 text-xl md:text-3xl my-6 underline decoration-indigo-500 decoration-4 underline-offset-8',
          footer: 'font-sans text-xs text-slate-500 leading-relaxed max-w-md mx-auto',
          borderCol: 'border-t border-indigo-200/50 pt-3',
        };
      case 'elegant':
        return {
          container: 'border-[12px] border-amber-600 outline outline-offset-8 outline-1 outline-amber-600/40 bg-amber-50/5 p-8 md:p-12 text-center rounded-md shadow-inner',
          title: 'font-serif italic text-amber-800 text-2xl md:text-4xl',
          subtitle: 'font-serif text-xs md:text-sm text-slate-500 italic mt-2',
          name: 'font-serif italic font-bold text-slate-800 text-xl md:text-3xl my-6 border-b border-amber-600/30 pb-2 inline-block',
          footer: 'font-serif text-xs text-slate-600 leading-relaxed max-w-md mx-auto italic',
          borderCol: 'border-t border-amber-200/50 pt-3',
        };
      case 'minimal':
        return {
          container: 'border border-slate-350 bg-white p-8 md:p-12 text-center rounded-sm',
          title: 'font-sans font-medium text-slate-900 tracking-widest uppercase text-xl md:text-3xl',
          subtitle: 'font-sans text-xs tracking-wider text-slate-400 mt-2',
          name: 'font-sans font-semibold text-slate-800 text-lg md:text-2xl my-6 bg-slate-50 px-6 py-2.5 rounded border border-slate-100 inline-block',
          footer: 'font-sans text-xs text-slate-500 leading-relaxed max-w-md mx-auto',
          borderCol: 'border-t border-slate-200 pt-3',
        };
      default: // classic
        return {
          container: 'border-[20px] border-slate-900 double bg-slate-50/10 p-8 md:p-12 text-center',
          title: 'font-serif font-black text-slate-900 uppercase text-2xl md:text-4xl tracking-tight',
          subtitle: 'font-serif text-xs md:text-sm text-slate-400 italic tracking-wider mt-2',
          name: 'font-serif font-bold text-slate-900 text-xl md:text-3xl my-6',
          footer: 'font-serif text-xs text-slate-600 leading-relaxed max-w-md mx-auto',
          borderCol: 'border-t border-slate-200 pt-3',
        };
    }
  };

  const preview = getStyleClasses();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 print:py-0 print:px-0">
      {/* Verification Status Card */}
      <div className="ef-card p-5 bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Verified Certificate</h4>
            <p className="text-xs text-emerald-700">
              This certificate is authentic and was issued by <span className="font-semibold">{event.name}</span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="ef-btn-primary px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Certificate Box */}
      <div className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden print:border-0 print:shadow-none print:rounded-none">
        <div className="p-8 md:p-12">
          <div className={preview.container}>
            {/* Header */}
            <div className="space-y-1.5">
              <h1 className={preview.title}>{layout.title || 'Certificate of Attendance'}</h1>
              <p className={preview.subtitle}>{layout.subtitle || 'This is proudly presented to'}</p>
            </div>

            {/* Recipient */}
            <div className="my-8">
              <h2 className={preview.name}>{certificate.attendeeName}</h2>
            </div>

            {/* Body */}
            <div className="space-y-6">
              <p className={preview.footer}>{layout.footerText || 'For active participation in the event.'}</p>

              {/* Signatures & Codes */}
              <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-6 border-t border-slate-100/60 mt-6 text-xs font-medium">
                <div className="text-left space-y-1.5">
                  <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Event Host</p>
                  <p className="text-sm font-bold text-slate-800">{layout.signatoryName || 'Event Organizer'}</p>
                  <p className="text-xs text-slate-500">{layout.signatoryTitle || 'Host'}</p>
                </div>

                <div className="text-right space-y-1.5">
                  <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Verification ID</p>
                  <p className="text-sm font-mono font-bold text-indigo-600">{certificate.verificationCode}</p>
                  <p className="text-xs text-slate-500">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
