'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { supabaseBrowser } from '@/lib/supabaseClient';

type AssetRow = {
  id?: string;
  created_at?: string;
  user_id?: string | null;

  kode: string;
  nama: string;
  jenis: string;
  merk: string;
  posisi: string;
  kondisi: string;
  lokasi: string;
  area: string;
  gedung: string;
  lantai: string;
  tgl_pemeriksaan: string | null;
  masa_berlaku: string | null;
  status: string;
  keterangan: string;
};

function toIsoDate(v: any): string | null {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    if (!d) return null;
    const mm = String(d.m).padStart(2, '0');
    const dd = String(d.d).padStart(2, '0');
    return `${d.y}-${mm}-${dd}`;
  }
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, '0');
    const mm = m[2].padStart(2, '0');
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

export default function DataTable({ showGreetingEmail }: { showGreetingEmail?: string }) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  const loadAssets = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAssets(
        data.map((r: any) => ({
          id: r.id,
          created_at: r.created_at,
          user_id: r.user_id ?? null,
          kode: r.kode ?? '',
          nama: r.nama ?? '',
          jenis: r.jenis ?? '',
          merk: r.merk ?? '',
          posisi: r.posisi ?? '',
          kondisi: r.kondisi ?? '',
          lokasi: r.lokasi ?? '',
          area: r.area ?? '',
          gedung: r.gedung ?? '',
          lantai: r.lantai ?? '',
          tgl_pemeriksaan: r.tgl_pemeriksaan ?? null,
          masa_berlaku: r.masa_berlaku ?? null,
          status: r.status ?? '',
          keterangan: r.keterangan ?? '',
        }))
      );
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const filtered = useMemo(() => {
    if (!q.trim()) return assets;
    const s = q.toLowerCase();
    return assets.filter((a) =>
      [
        a.kode, a.nama, a.jenis, a.merk, a.posisi, a.kondisi,
        a.lokasi, a.area, a.gedung, a.lantai, a.status, a.keterangan,
      ]
        .join(' ')
        .toLowerCase()
        .includes(s)
    );
  }, [assets, q]);

  // ====== REKAP ======
  const norm = (v: any) =>
    String(v ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

  const tallies = useMemo(() => {
    const c = {
      apar: 0, aparPowder: 0, aparCo2: 0, aparMist: 0,
      hidran: 0, hidranIndoor: 0, hidranOutdoor: 0,
      detector: 0, detSmoke: 0, detHeat: 0, detBeam: 0,
      sprinkler: 0, p3k: 0,
    };
    for (const a of assets) {
      const n = norm(a.nama);
      const j = norm(a.jenis);
      const p = norm(a.posisi);
      const k = norm(a.keterangan);

      if (n === 'apar') {
        c.apar++;
        if (j.includes('powder')) c.aparPowder++;
        if (j.includes('co2')) c.aparCo2++;
        if (j.includes('water mist') || j.includes('wet chemical')) c.aparMist++;
      }
      if (n === 'hidran') {
        c.hidran++;
        if (p.includes('indoor')) c.hidranIndoor++;
        if (p.includes('outdoor')) c.hidranOutdoor++;
      }
      if (n === 'detector') {
        c.detector++;
        if (j.includes('smoke') || k.includes('smoke')) c.detSmoke++;
        if (j.includes('heat') || k.includes('heat')) c.detHeat++;
        if (j.includes('beam') || k.includes('beam')) c.detBeam++;
      }
      if (n === 'sprinkler') c.sprinkler++;
      if (n === 'kotak p3k' || n === 'p3k') c.p3k++;
    }
    return c;
  }, [assets]);

  // ====== Upload XLSX ======
  async function handleUploadXlsx(file: File) {
    try {
      setLoading(true);

      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

      const normalizeKey = (s: string) => s.trim().toLowerCase();
      const toRow = (r: any): AssetRow => {
        const kv: Record<string, any> = {};
        Object.keys(r).forEach((k) => (kv[normalizeKey(k)] = r[k]));

        return {
          kode: kv['kode'] || '',
          nama: kv['nama'] || '',
          jenis: kv['jenis'] || '',
          merk: kv['merk'] || '',
          posisi: kv['posisi'] || '',
          kondisi: kv['kondisi'] || '',
          lokasi: kv['lokasi'] || '',
          area: kv['area'] || '',
          gedung: kv['gedung'] || '',
          lantai: kv['lantai'] || '',
          tgl_pemeriksaan: toIsoDate(kv['tgl pemeriksaan'] ?? kv['tgl_pemeriksaan']),
          masa_berlaku: toIsoDate(kv['masa berlaku'] ?? kv['masa_berlaku']),
          status: kv['status'] || '',
          keterangan: kv['keterangan'] || '',
        };
      };

      const payload = rows.map(toRow).filter((x) => x.kode || x.nama);
      if (payload.length === 0) {
        alert('Tidak ada baris valid pada file Excel.');
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;

      const { error } = await supabase.from('assets').insert(
        payload.map((p) => ({ ...p, user_id: uid }))
      );
      if (error) throw error;

      await loadAssets();
      alert(`Upload berhasil: ${payload.length} baris ditambahkan.`);
    } catch (e: any) {
      console.error(e);
      alert(`Gagal upload: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  }

  function exportExcel() {
    const rows = filtered.map((a) => ({
      Kode: a.kode,
      Nama: a.nama,
      Jenis: a.jenis,
      Merk: a.merk,
      Posisi: a.posisi,
      Kondisi: a.kondisi,
      Lokasi: a.lokasi,
      Area: a.area,
      Gedung: a.gedung,
      Lantai: a.lantai,
      'Tgl Pemeriksaan': a.tgl_pemeriksaan ?? '',
      'Masa Berlaku': a.masa_berlaku ?? '',
      Status: a.status,
      Keterangan: a.keterangan,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assets');
    XLSX.writeFile(wb, 'assets_export.xlsx');
  }

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-6 py-6">
      {showGreetingEmail && (
        <p className="mb-6 text-neutral-800">
          Selamat datang, {showGreetingEmail}!
        </p>
      )}

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">APAR</h3>
          <p className="text-sm">Total: {tallies.apar}</p>
          <p className="text-sm">Powder: {tallies.aparPowder}</p>
          <p className="text-sm">CO2: {tallies.aparCo2}</p>
          <p className="text-sm">Water Mist: {tallies.aparMist}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">HIDRAN</h3>
          <p className="text-sm">Total: {tallies.hidran}</p>
          <p className="text-sm">Indoor: {tallies.hidranIndoor}</p>
          <p className="text-sm">Outdoor: {tallies.hidranOutdoor}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">DETECTOR</h3>
          <p className="text-sm">Total: {tallies.detector}</p>
          <p className="text-sm">Smoke: {tallies.detSmoke}</p>
          <p className="text-sm">Heat: {tallies.detHeat}</p>
          <p className="text-sm">Beam: {tallies.detBeam}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">SPRINKLER</h3>
          <p className="text-sm">Total: {tallies.sprinkler}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">KOTAK P3K</h3>
          <p className="text-sm">Total: {tallies.p3k}</p>
          <p className="text-sm">Tipe A: –</p>
          <p className="text-sm">Tipe B: –</p>
          <p className="text-sm">Tipe C: –</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari asset…"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 md:w-[28rem]"
        />

        <button
          onClick={() => router.push('/input')}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Input Data
        </button>

        <label className="relative inline-flex">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUploadXlsx(f);
              (e.target as HTMLInputElement).value = '';
            }}
          />
          <span className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-900">
            Upload Excel
          </span>
        </label>

        <button
          onClick={exportExcel}
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Ekspor Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full table-fixed text-sm">
          {/* Atur lebar kolom agar rapi & beberapa kolom no-wrap */}
          <colgroup>
  {[
    '9rem',  // KODE
    '8rem',  // NAMA
    '9rem',  // JENIS
    '8rem',  // MERK
    '8rem',  // POSISI
    '8rem',  // KONDISI
    '10rem', // LOKASI
    '10rem', // AREA
    '7rem',  // GEDUNG
    '6rem',  // LANTAI
    '10rem', // TGL PEMERIKSAAN
    '10rem', // MASA BERLAKU
    '8rem',  // STATUS
    'auto',  // KETERANGAN
  ].map((w, i) => (
    <col key={i} style={{ width: w }} />
  ))}
</colgroup>

        <thead className="sticky top-0 z-10 bg-neutral-50/95 backdrop-blur">
            <tr className="text-left">
              {[
                'KODE','NAMA','JENIS','MERK','POSISI','KONDISI','LOKASI','AREA','GEDUNG','LANTAI',
                'TGL PEMERIKSAAN','MASA BERLAKU','STATUS','KETERANGAN'
              ].map((h) => (
                <th key={h} className="border-b px-4 py-3 font-semibold text-neutral-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={14} className="px-4 py-6 text-center text-neutral-500">Memuat data…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-4 py-6 text-center text-neutral-500">Belum ada data.</td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id ?? `${a.kode}-${a.nama}-${a.created_at}`} className="align-top">
                  {/* KODE: 1 baris + font monospace biar rapih */}
                  <td className="border-b px-4 py-2 whitespace-nowrap font-mono">{a.kode}</td>
                  <td className="border-b px-4 py-2">{a.nama}</td>
                  <td className="border-b px-4 py-2">{a.jenis}</td>
                  <td className="border-b px-4 py-2">{a.merk}</td>
                  <td className="border-b px-4 py-2">{a.posisi}</td>
                  <td className="border-b px-4 py-2">{a.kondisi}</td>
                  <td className="border-b px-4 py-2">{a.lokasi}</td>
                  <td className="border-b px-4 py-2">{a.area}</td>
                  <td className="border-b px-4 py-2">{a.gedung}</td>
                  <td className="border-b px-4 py-2">{a.lantai}</td>
                  <td className="border-b px-4 py-2">{a.tgl_pemeriksaan ?? ''}</td>
                  {/* MASA BERLAKU: 1 baris */}
                  <td className="border-b px-4 py-2 whitespace-nowrap">{a.masa_berlaku ?? ''}</td>
                  <td className="border-b px-4 py-2">{a.status}</td>
                  {/* Keterangan dibiarkan fleksibel, ellipsis jika perlu */}
                  <td className="border-b px-4 py-2 overflow-hidden text-ellipsis">{a.keterangan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}