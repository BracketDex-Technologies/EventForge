import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="w-full py-4 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image src="/logo-icon.svg" alt="EventForge" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight text-slate-900">EventForge</span>
        </Link>
        <Link href="/login" className="ef-btn-ghost text-sm">
          Return to Login
        </Link>
      </header>
      
      <main className="flex-1 py-16 px-6 lg:px-10 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <h2>1. Information We Collect</h2>
          <p>We collect information to provide better services to all our users. The information we collect, and how that information is used, depends on how you use our services.</p>
          
          <h2>2. How We Use Information</h2>
          <p>We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect EventForge and our users.</p>
          
          <h2>3. Information We Share</h2>
          <p>We do not share personal information with companies, organizations and individuals outside of EventForge unless one of the following circumstances applies: with your consent, for external processing, or for legal reasons.</p>
          
          <h2>4. Information Security</h2>
          <p>We work hard to protect EventForge and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.</p>
          
          <h2>5. Changes</h2>
          <p>Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent.</p>
        </div>
      </main>
      
      <footer className="border-t border-slate-200 bg-white py-10 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} EventForge. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
