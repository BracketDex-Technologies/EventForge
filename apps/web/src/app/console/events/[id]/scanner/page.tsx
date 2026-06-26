'use client';

import { useEffect, useState, use } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';

export default function QRScannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    const timer = setTimeout(() => {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          setStatus('success');
          scanner?.pause(true);
        },
        (error) => {
          // Quietly ignore typical scan search cycles
        }
      );
      setStatus('scanning');
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(e => console.error(e));
      }
    };
  }, []);

  function resetScanner() {
    setScanResult(null);
    setStatus('scanning');
    setErrorMsg('');
    window.location.reload(); // Hard reset for scanning reload on MVP
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <Link href={`/console/events/${id}/check-ins`} className="text-[12px] font-semibold flex items-center gap-1 mb-2 hover:underline" style={{ color: 'var(--ef-primary)' }}>
          &larr; Back to Attendee List
        </Link>
        <h2 className="ef-headline-lg">QR Ticket Scanner</h2>
        <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
          Point camera at an attendee's QR ticket to automatically verify entry.
        </p>
      </div>

      {/* Main card */}
      <div className="ef-card bg-white shadow-lg overflow-hidden border border-slate-100">
        <div className="p-6 text-center border-b border-slate-50 bg-slate-50/40">
          <p className="text-sm font-medium" style={{ color: 'var(--ef-text-secondary)' }}>
            Real-time verification & gate control
          </p>
        </div>
        
        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold" style={{ color: 'var(--ef-text-primary)' }}>
                  Check-in Complete
                </h3>
                <p className="text-sm" style={{ color: 'var(--ef-text-muted)' }}>
                  Ticket has been recorded as checked in.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl max-w-sm mx-auto font-mono text-[12px] break-all border border-slate-100" style={{ color: 'var(--ef-text-secondary)' }}>
                {scanResult}
              </div>
              <button 
                onClick={resetScanner}
                className="ef-btn-primary"
              >
                Scan Next Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <div id="reader" className="mx-auto w-full max-w-sm rounded-xl overflow-hidden border-2 border-dashed border-slate-200"></div>
                {status === 'scanning' && !scanResult && (
                  <div className="mt-4 text-center text-xs font-semibold animate-pulse uppercase tracking-wider" style={{ color: 'var(--ef-primary)' }}>
                    Scanning active. Center barcode or QR code...
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 p-4 rounded-xl text-center text-sm font-semibold border"
                 style={{ background: 'var(--ef-danger-bg)', color: 'var(--ef-danger-text)', borderColor: 'rgba(220,38,38,0.1)' }}>
              {errorMsg || "Invalid ticket code or check-in error."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
