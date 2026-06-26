import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { ConsoleLayoutWrapper } from './components/ConsoleLayoutWrapper';

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
    <ConsoleLayoutWrapper userEmail={user.email}>
      {children}
    </ConsoleLayoutWrapper>
  );
}
