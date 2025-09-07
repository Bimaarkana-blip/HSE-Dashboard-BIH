// app/api/assets/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";

// helper: pilih "lainnya" bila opsi lain dipilih
const pick = (chosen: string | null | undefined, other: string | null | undefined) =>
  chosen === "lainnya" ? (other?.trim() || null) : (chosen?.trim() || null);

// helper: sanitize string kosong -> null
const s = (v: string | null | undefined) => (v?.trim() ? v.trim() : null);

// helper: angka (lantai) -> number | null
const n = (v: string | number | null | undefined) => {
  if (v === null || v === undefined || v === "") return null;
  const num = typeof v === "number" ? v : Number(v);
  return Number.isFinite(num) ? num : null;
};

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // auth (server side)
    const supabase = supabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // susun row sesuai kolom tabel "assets"
    const row = {
      user_id_uuid: session.user.id,

      // teks
      kode: s(payload.kode),
      nama: s(payload.nama),
      merk: s(payload.merk),

      // opsi yang memiliki "lainnya"
      jenis: pick(payload.jenis, payload.jenisLain),
      posisi: pick(payload.posisi, payload.posisiLain),
      kondisi: pick(payload.kondisi, payload.kondisiLain),
      lokasi: pick(payload.lokasi, payload.lokasiLain),
      area: pick(payload.area, payload.areaLain),

      gedung: s(payload.gedung), // A/B/C/D/E/F
      lantai: n(payload.lantai),  // 1/2/3/4 (atau null)

      // tanggal (format <input type="date"/>: yyyy-MM-dd) -> simpan string apa adanya
      tgl_pemeriksaan: s(payload.tglPemeriksaan),
      masa_berlaku: s(payload.masaBerlaku),

      status: pick(payload.status, payload.statusLain),
      keterangan: s(payload.keterangan),
    };

    // insert
    const { error } = await supabase.from("assets").insert(row);
    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 👉 penting: paksa server components membaca data terbaru
    revalidatePath("/dashboard");

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}