# HSE-Dashboard-BIH

Dashboard internal untuk pencatatan dan rekap aset HSE (APAR, Hidran, Detector, Sprinkler, Kotak P3K) di BIH.  
Stack: **Next.js 15**, **React 19**, **TailwindCSS**, **Supabase** (Auth + DB), **XLSX** (import/ekspor).

---

## Fitur
- Input aset via form (dengan opsi “lainnya” pada beberapa field).
- Rekap otomatis di dashboard:
  - **APAR**: Total dari kolom `nama = "APAR"`, rinci **Powder/CO2/Water Mist/Wet Chemical** dari kolom `jenis`.
  - **Hidran**: Indoor/Outdoor dari kolom `posisi`.
  - **Detector**: Smoke/Heat/Beam dari `jenis` atau `keterangan`.
- Import dari **Excel** (`.xlsx/.xls`) dan **Ekspor** ke Excel.
- Filter/pencarian aset.
- Autentikasi via Supabase.

---

## Prasyarat
- **Node.js 18+** (disarankan LTS terbaru)
- Akun **Supabase** (Database + Auth)
- (Opsional) Akun **Vercel** untuk deploy

---

## Konfigurasi Environment

Buat file `.env.local` di root proyek:

```env
# Supabase — client (browser)
NEXT_PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"

# (opsional) untuk server-side service role — hanya bila diperlukan
# SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"