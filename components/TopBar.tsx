'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { ButtonHTMLAttributes } from 'react';

function PillButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' },
) {
  const { className = '', variant = 'primary', ...rest } = props;
  const color =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-zinc-800 hover:bg-zinc-700';
  return (
    <button
      {...rest}
      className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${color} ${className}`}
    />
  );
}

export default function TopBar() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-900/80 px-4 py-3 md:px-6">
      <div className="flex items-center gap-4">
        <Image
          src="/logo-bih.png"
          alt="Bali International Hospital"
          width={220}
          height={70}
          className="h-10 w-auto"
          priority
        />
        <h1 className="text-lg font-semibold tracking-wide">HSE BIH ASSET</h1>
      </div>

      <div className="flex items-center gap-3">
        <PillButton onClick={() => router.push('/input')}>INPUT DATA</PillButton>
        <PillButton onClick={() => router.push('/upload')}>UPLOAD EXCEL</PillButton>
        <PillButton variant="danger" onClick={handleLogout}>KELUAR</PillButton>
      </div>
    </header>
  );
}