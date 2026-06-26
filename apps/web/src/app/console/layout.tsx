import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { Sidebar } from './components/Sidebar';

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const member = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!member) {
    redirect('/onboarding');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userEmail={user.email} />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
