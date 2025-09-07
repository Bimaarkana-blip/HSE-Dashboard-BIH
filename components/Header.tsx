'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function Header() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function onLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <header className="border-b bg-white">
      {/* Container sama kayak dashboard */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Kiri: Logo + Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-bih.png"
            alt="Bali International Hospital"
            width={150}   // biar ukurannya sama seperti sebelumnya
            height={40}
            priority
          />
          <h1 className="text-lg font-semibold tracking-wide text-neutral-900">
            HSE BIH ASSET
          </h1>
        </div>

        {/* Kanan: Tombol Logout */}
        <button
          onClick={onLogout}
          className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}