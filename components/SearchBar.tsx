// components/SearchBar.tsx
'use client';

import { Search } from 'lucide-react';

type Props = {
  onSearch?: (q: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  return (
    <div className="flex items-stretch gap-2">
      <input
        className="flex-1 rounded-md bg-zinc-900 border border-zinc-700 px-4 py-2 text-white"
        placeholder="CARI ASSET"
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <button
        type="button"
        className="px-4 rounded-md bg-zinc-800 hover:bg-zinc-700"
        title="Cari"
      >
        <Search />
      </button>
    </div>
  );
}