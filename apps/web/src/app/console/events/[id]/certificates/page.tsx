import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TemplateDesignerForm from './TemplateDesignerForm';
import IssueCertificatesButton from './IssueCertificatesButton';

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Load templates
  const templates = await prisma.certificateTemplate.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  // Load issued certificates
  const issued = await prisma.certificate.findMany({
    where: { eventId: id },
    orderBy: { issuedAt: 'desc' },
    include: {
      template: {
        select: {
          name: true,
        },
      },
    },
  });

  const defaultLayout = {
    title: 'Certificate of Attendance',
    subtitle: 'This is proudly presented to',
    footerText: 'For active participation in the event.',
    signatoryName: 'Event Organizer',
    signatoryTitle: 'Host',
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Certificates</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Certificate Builder</h2>
        <p className="mt-1 text-sm text-slate-500">Design custom participation certificates and issue them to your attendees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Designer panel */}
        <div className="lg:col-span-1">
          <div className="ef-card p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Design Template</h3>
              <p className="text-xs text-slate-400 mt-1">Configure layout, typography, and styling.</p>
            </div>

            <TemplateDesignerForm
              eventId={id}
              initialTemplate={templates[0] ? {
                id: templates[0].id,
                name: templates[0].name,
                style: templates[0].style,
                layout: templates[0].layout as any,
                isDefault: templates[0].isDefault,
              } : {
                id: null,
                name: 'Standard Participation Certificate',
                style: 'classic',
                layout: defaultLayout,
                isDefault: true,
              }}
            />
          </div>
        </div>

        {/* Issued certificates listing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ef-card p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Issued Certificates ({issued.length})</h3>
                <p className="text-xs text-slate-400 mt-1">Attendees will receive verification codes to download their certificates.</p>
              </div>

              {templates.length > 0 && (
                <IssueCertificatesButton 
                  eventId={id} 
                  templateId={templates[0].id} 
                />
              )}
            </div>

            {issued.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-400 flex items-center justify-center">
                  🎓
                </div>
                <p className="text-sm font-semibold text-slate-700">No certificates issued yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Once you design a template, click "Issue Certificates" to generate PDFs for all valid ticket holders.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="ef-table">
                  <thead>
                    <tr>
                      <th>Attendee</th>
                      <th>Template</th>
                      <th>Verification Code</th>
                      <th>Issued Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issued.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                        <td>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900">{cert.attendeeName}</p>
                            <p className="text-xs text-slate-500">{cert.attendeeEmail}</p>
                          </div>
                        </td>
                        <td className="text-xs font-semibold text-slate-600">{cert.template.name}</td>
                        <td>
                          <code className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                            {cert.verificationCode}
                          </code>
                        </td>
                        <td className="text-xs text-slate-500 font-medium">
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="text-right">
                          <Link
                            href={`/e/${id}/verify/${cert.verificationCode}`}
                            target="_blank"
                            className="ef-btn-secondary text-[11px] px-2.5 py-1.5 font-bold"
                          >
                            Verify &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
