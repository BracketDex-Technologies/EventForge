export default async function ConsoleBillingPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="ef-headline-lg text-3xl font-bold">Billing & Subscription</h2>
        <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
          Manage your subscription plans, invoice history, and resource limits.
        </p>
      </div>

      {/* Main Stats Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier Card */}
        <div className="ef-card p-6 bg-white flex flex-col justify-between h-[160px]">
          <div>
            <span className="ef-label-sm" style={{ color: 'var(--ef-text-muted)' }}>Current Subscription Plan</span>
            <h3 className="text-xl font-bold mt-1" style={{ color: 'var(--ef-text-primary)' }}>Pro Plan</h3>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 py-0.5 px-2.5 rounded-full">
              Renews Jan 1, 2027
            </span>
            <p className="text-2xl font-extrabold" style={{ color: 'var(--ef-text-primary)' }}>
              $99<span className="text-xs font-normal" style={{ color: 'var(--ef-text-muted)' }}>/mo</span>
            </p>
          </div>
        </div>

        {/* Tickets Limits */}
        <div className="ef-card p-6 bg-white flex flex-col justify-between h-[160px]">
          <div>
            <span className="ef-label-sm" style={{ color: 'var(--ef-text-muted)' }}>Included Tickets Sales</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--ef-text-primary)' }}>4,500</span>
              <span className="text-xs font-medium" style={{ color: 'var(--ef-text-muted)' }}>of 10,000 max</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full" style={{ width: '45%', background: 'var(--ef-primary-gradient)' }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--ef-text-muted)' }}>
              <span>45% Used</span>
              <span>5,500 Available</span>
            </div>
          </div>
        </div>

        {/* Team Seats */}
        <div className="ef-card p-6 bg-white flex flex-col justify-between h-[160px]">
          <div>
            <span className="ef-label-sm" style={{ color: 'var(--ef-text-muted)' }}>Team Seats</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--ef-text-primary)' }}>3</span>
              <span className="text-xs font-medium" style={{ color: 'var(--ef-text-muted)' }}>of 5 seats</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--ef-text-muted)' }}>
              <span>60% Used</span>
              <span>2 Seats Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action buttons */}
      <div className="ef-card p-6 bg-white flex items-center justify-between flex-wrap gap-4 border border-slate-100">
        <div>
          <h4 className="font-semibold text-sm" style={{ color: 'var(--ef-text-primary)' }}>Modify current billing method</h4>
          <p className="text-[12px]" style={{ color: 'var(--ef-text-muted)' }}>Add credit card, change pricing terms or cancel active tiers.</p>
        </div>
        <div className="flex gap-3">
          <button className="ef-btn-secondary">Change Plan</button>
          <button className="ef-btn-primary">Manage Subscription</button>
        </div>
      </div>

      {/* Invoice list card */}
      <div className="ef-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-sm text-gray-900">Invoice History</h3>
        </div>
        <table className="ef-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-right">Download</th>
            </tr>
          </thead>
          <tbody>
            <tr className="ef-card-hover">
              <td style={{ color: 'var(--ef-text-secondary)' }}>Dec 1, 2026</td>
              <td className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>$99.00</td>
              <td>
                <span className="ef-badge ef-badge-success">Paid</span>
              </td>
              <td className="text-right">
                <button className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-indigo-500/5"
                        style={{ color: 'var(--ef-primary)' }}>
                  Download PDF
                </button>
              </td>
            </tr>
            <tr className="ef-card-hover">
              <td style={{ color: 'var(--ef-text-secondary)' }}>Nov 1, 2026</td>
              <td className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>$99.00</td>
              <td>
                <span className="ef-badge ef-badge-success">Paid</span>
              </td>
              <td className="text-right">
                <button className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-indigo-500/5"
                        style={{ color: 'var(--ef-primary)' }}>
                  Download PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
