'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-md bg-red-600 hover:bg-red-700 text-white py-2 mt-4"
    >
      Logout
    </button>
  );
}