// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const email = session.user.email ?? '';

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Header />
      <DataTable showGreetingEmail={email} />
    </main>
  );
}