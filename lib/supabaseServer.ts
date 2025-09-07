// lib/supabaseServer.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function supabaseServer() {
  const cookieStore = cookies();

  // RSC-safe: hanya baca cookie; set/remove NO-OP
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Penting: di Server Component TIDAK BOLEH menulis cookie
        set() {},
        remove() {},
      },
    }
  );
}