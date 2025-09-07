// app/input/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import InputForm from '@/components/InputForm';

export default async function InputPage() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-wide mb-6">
          Tambah Data Asset
        </h1>
        <InputForm userId={session.user.id} />
      </div>
    </main>
  );
}