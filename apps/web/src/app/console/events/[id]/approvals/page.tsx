import { prisma } from '@eventforge/db';
import { evaluateApprovalPolicy } from '@eventforge/domain';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, CircleAlert, ShieldCheck } from 'lucide-react';
import ApprovalActions from './ApprovalActions';

export default async function ApprovalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      approvalPolicies: { orderBy: { createdAt: 'desc' } },
      approvalRequests: { orderBy: { createdAt: 'desc' }, take: 25 },
      ticketTypes: { select: { quantityTotal: true, quantitySold: true } },
    },
  });

  if (!event) notFound();

  const activeRegistrationPolicy =
    event.approvalPolicies.find(policy => policy.requestType === 'registration' && policy.isActive) ??
    null;
  const pendingRequests = event.approvalRequests.filter(request => request.status === 'pending');
  const approvedRequests = event.approvalRequests.filter(request => request.status === 'approved');
  const rejectedRequests = event.approvalRequests.filter(request => request.status === 'rejected');

  const availableCapacity = event.ticketTypes.reduce((sum, ticketType) => {
    if (ticketType.quantityTotal === 0) return sum + 1000;
    return sum + Math.max(ticketType.quantityTotal - ticketType.quantitySold, 0);
  }, 0);

  const simulatedDecision = activeRegistrationPolicy
    ? evaluateApprovalPolicy({
        approvalMode: toApprovalMode(activeRegistrationPolicy.mode),
        requestType: 'registration',
        availableCapacity,
        attendeeCount: 4,
        answers: { email: 'procurement@enterprise.example' },
        blockedDomains: toStringList(activeRegistrationPolicy.blockedDomains),
        requireApprovalForDomains: toStringList(activeRegistrationPolicy.reviewDomains),
      })
    : null;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">
              Event Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600">Approvals</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Registration Approvals</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review registration and cancellation requests before capacity, compliance, or enterprise rules are affected.
          </p>
        </div>
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-right">
          <p className="text-2xl font-bold text-indigo-700">{pendingRequests.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500">pending review</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Pending" value={pendingRequests.length} tone="warning" />
        <Metric label="Approved" value={approvedRequests.length} tone="success" />
        <Metric label="Rejected" value={rejectedRequests.length} tone="danger" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="ef-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="ef-label-sm">Policy engine</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Active registration policy</h3>
            </div>
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
          </div>

          {activeRegistrationPolicy ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">{activeRegistrationPolicy.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Mode: <span className="font-bold uppercase">{activeRegistrationPolicy.mode}</span>
                </p>
              </div>

              <PolicyList
                label="Blocked domains"
                values={toStringList(activeRegistrationPolicy.blockedDomains)}
                empty="No blocked domains"
              />
              <PolicyList
                label="Review domains"
                values={toStringList(activeRegistrationPolicy.reviewDomains)}
                empty="No manual-review domains"
              />

              {simulatedDecision && (
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
                    AI policy simulation
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    procurement@enterprise.example: {simulatedDecision.decision.replace('_', ' ')}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{simulatedDecision.reasons.join(' ')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-bold text-slate-900">No active registration policy</p>
              <p className="mt-1 text-xs text-slate-600">
                Add a policy to support enterprise review, blocked domains, cancellation approval, and capacity controls.
              </p>
            </div>
          )}
        </section>

        <section className="ef-card overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <p className="ef-label-sm">Review queue</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Requests requiring organizer action</h3>
          </div>
          {event.approvalRequests.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-3 text-sm font-bold text-slate-900">No approval requests yet</p>
              <p className="mt-1 text-xs text-slate-500">Requests will appear here when policy rules require review.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {event.approvalRequests.map(request => (
                <div key={request.id} className="p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' ? (
                          <CircleAlert className="h-4 w-4 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        )}
                        <p className="text-sm font-bold text-slate-900">
                          {request.requestType.replace('_', ' ')} request
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{request.requesterEmail ?? 'No requester email'}</p>
                      {request.decisionReason && (
                        <p className="mt-2 text-xs leading-5 text-slate-600">{request.decisionReason}</p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        request.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : request.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  {request.status === 'pending' && (
                    <div className="mt-4">
                      <ApprovalActions eventId={event.id} requestId={request.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'success' | 'warning' | 'danger';
  value: number;
}) {
  const className = {
    success: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    danger: 'border-l-rose-500',
  }[tone];

  return (
    <div className={`ef-card border-l-4 p-5 ${className}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function PolicyList({
  empty,
  label,
  values,
}: {
  empty: string;
  label: string;
  values: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map(value => (
            <span key={value} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {value}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">{empty}</span>
        )}
      </div>
    </div>
  );
}

function toStringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toApprovalMode(value: string) {
  return value === 'off' || value === 'manual' || value === 'conditional' ? value : 'conditional';
}
