// lib/supabaseRoute.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function supabaseRoute() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: Parameters<typeof cookieStore.set>[1]) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options?: Parameters<typeof cookieStore.set>[1]) {
          cookieStore.set(name, '', { ...options, expires: new Date(0) });
        },
      },
    }
  );
}