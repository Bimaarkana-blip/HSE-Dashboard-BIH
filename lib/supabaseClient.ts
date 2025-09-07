'use client';

import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Jangan biarkan meledak tanpa pesan yang jelas
  // Ini akan tampil di console dan mempermudah debugging
  // dan mencegah unhandled rejection yang bikin UI kedip.
  // Anda tetap bisa render UI tanpa memanggil supabase dulu.
  console.error(
    '[supabaseClient] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export function supabaseBrowser() {
  if (!url || !anon) {
    throw new Error(
      'Konfigurasi Supabase client belum lengkap. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local lalu restart dev server.'
    );
  }
  return createBrowserClient(url, anon);
}