'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message || 'Gagal login');
      return;
    }

    setMsg('Login berhasil! Mengarahkan ke dashboard...');
    startTransition(() => {
      router.replace('/dashboard');
    });
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-bih.png"
            width={160}
            height={60}
            alt="Bali International Hospital"
            priority
          />
        </div>

        {/* Judul */}
        <h1 className="text-center text-xl font-semibold tracking-wide mb-6">
          HSE BIH ASSET
        </h1>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="email@domain.com"
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-zinc-900 text-white font-medium py-2 hover:bg-zinc-800 text-sm disabled:opacity-60"
          >
            {isPending ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-xs mt-3 text-zinc-600">
          Belum punya akun?{' '}
          <a href="/register" className="underline hover:text-zinc-800">
            Daftar
          </a>
        </p>

        {msg && <p className="text-emerald-600 text-center mt-2 text-sm">{msg}</p>}
        {error && <p className="text-red-600 text-center mt-2 text-sm">{error}</p>}
      </div>
    </main>
  );
}