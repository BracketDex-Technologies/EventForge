import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-slate-600">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of the terms, then you may not access the service.</p>
          
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on EventForge's website for personal, non-commercial transitory viewing only.</p>
          
          <h2>3. Disclaimer</h2>
          <p>The materials on EventForge's website are provided on an 'as is' basis. EventForge makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2>4. Limitations</h2>
          <p>In no event shall EventForge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EventForge's website.</p>
          
          <h2>5. Revisions and Errata</h2>
          <p>The materials appearing on EventForge's website could include technical, typographical, or photographic errors. EventForge does not warrant that any of the materials on its website are accurate, complete, or current.</p>
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
