'use client'

import { useState, useEffect } from "react";

export default function InputForm() {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    jenis: "",
    jenisLain: "",
    merk: "",
    posisi: "",
    posisiLain: "",
    kondisi: "",
    kondisiLain: "",
    lokasi: "",
    lokasiLain: "",
    area: "",
    areaLain: "",
    gedung: "",
    lantai: "",
    tglPemeriksaan: "",
    masaBerlaku: "", // string untuk tanggal, kosong jika "lainnya"
    status: "",
    statusLain: "",
    keterangan: "",
  });

  // 👉 state tambahan untuk kontrol radio Masa Berlaku
  const [masaBerlakuOption, setMasaBerlakuOption] =
    useState<"tanggal" | "lainnya">(form.masaBerlaku ? "tanggal" : "lainnya");

  // sinkronisasi kalau ada perubahan langsung di form.masaBerlaku
  useEffect(() => {
    if (form.masaBerlaku) {
      setMasaBerlakuOption("tanggal");
    } else {
      setMasaBerlakuOption("lainnya");
    }
  }, [form.masaBerlaku]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert("Gagal menyimpan: " + (error ?? res.statusText));
        return;
      }

      alert("Berhasil disimpan!");
      // reset form
      setForm({
        kode: "",
        nama: "",
        jenis: "",
        jenisLain: "",
        merk: "",
        posisi: "",
        posisiLain: "",
        kondisi: "",
        kondisiLain: "",
        lokasi: "",
        lokasiLain: "",
        area: "",
        areaLain: "",
        gedung: "",
        lantai: "",
        tglPemeriksaan: "",
        masaBerlaku: "",
        status: "",
        statusLain: "",
        keterangan: "",
      });
      setMasaBerlakuOption("tanggal"); // reset ke default
    } catch (err: any) {
      alert("Terjadi error jaringan: " + err?.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow"
    >
      {/* Kode */}
      <div>
        <label className="block font-semibold">Kode Aset *</label>
        <input
          type="text"
          value={form.kode}
          onChange={(e) => handleChange("kode", e.target.value)}
          className="mt-1 w-full border rounded p-2"
          required
        />
      </div>

      {/* Nama */}
      <div>
        <label className="block font-semibold">Nama *</label>
        <input
          type="text"
          value={form.nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          className="mt-1 w-full border rounded p-2"
          required
        />
      </div>

      {/* Jenis */}
      <div>
        <label className="block font-semibold">Jenis *</label>
        {["Powder", "Water Mist/Wet Chemical", "CO2", "Smoke", "Heat", "Beam"].map(
          (opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="jenis"
                value={opt}
                checked={form.jenis === opt}
                onChange={(e) => handleChange("jenis", e.target.value)}
              />{" "}
              {opt}
            </label>
          )
        )}
        <label className="block">
          <input
            type="radio"
            name="jenis"
            value="lainnya"
            checked={form.jenis === "lainnya"}
            onChange={() => handleChange("jenis", "lainnya")}
          />{" "}
          Lainnya:
          {form.jenis === "lainnya" && (
            <input
              type="text"
              value={form.jenisLain}
              onChange={(e) => handleChange("jenisLain", e.target.value)}
              className="ml-2 border rounded p-1"
            />
          )}
        </label>
      </div>

      {/* Posisi */}
      <div>
        <label className="block font-semibold">Posisi *</label>
        {["IHB", "Box", "No Box", "Indoor", "Outdoor"].map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="posisi"
              value={opt}
              checked={form.posisi === opt}
              onChange={(e) => handleChange("posisi", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
        <label className="block">
          <input
            type="radio"
            name="posisi"
            value="lainnya"
            checked={form.posisi === "lainnya"}
            onChange={() => handleChange("posisi", "lainnya")}
          />{" "}
          Lainnya:
          {form.posisi === "lainnya" && (
            <input
              type="text"
              value={form.posisiLain}
              onChange={(e) => handleChange("posisiLain", e.target.value)}
              className="ml-2 border rounded p-1"
            />
          )}
        </label>
      </div>

      {/* Kondisi */}
      <div>
        <label className="block font-semibold">Kondisi *</label>
        {["Baik", "Tidak Baik"].map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="kondisi"
              value={opt}
              checked={form.kondisi === opt}
              onChange={(e) => handleChange("kondisi", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
        <label className="block">
          <input
            type="radio"
            name="kondisi"
            value="lainnya"
            checked={form.kondisi === "lainnya"}
            onChange={() => handleChange("kondisi", "lainnya")}
          />{" "}
          Lainnya:
          {form.kondisi === "lainnya" && (
            <input
              type="text"
              value={form.kondisiLain}
              onChange={(e) => handleChange("kondisiLain", e.target.value)}
              className="ml-2 border rounded p-1"
            />
          )}
        </label>
      </div>

      {/* Lokasi */}
      <div>
        <label className="block font-semibold">Lokasi *</label>
        {[
          "Koridor Luar",
          "Koridor Dalam",
          "Ruang Tunggu",
          "Kamar Pasien",
          "Atap",
          "Panel",
          "Toilet",
        ].map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="lokasi"
              value={opt}
              checked={form.lokasi === opt}
              onChange={(e) => handleChange("lokasi", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
        <label className="block">
          <input
            type="radio"
            name="lokasi"
            value="lainnya"
            checked={form.lokasi === "lainnya"}
            onChange={() => handleChange("lokasi", "lainnya")}
          />{" "}
          Lainnya:
          {form.lokasi === "lainnya" && (
            <input
              type="text"
              value={form.lokasiLain}
              onChange={(e) => handleChange("lokasiLain", e.target.value)}
              className="ml-2 border rounded p-1"
            />
          )}
        </label>
      </div>

      {/* Area */}
      <div>
        <label className="block font-semibold">Area *</label>
        {[
          "Emergency",
          "Shindu Clinic",
          "Laboratorium",
          "ICT",
          "Rekam Medis",
          "Mushola Besar",
          "Surgical ICU",
          "OT",
          "Cathlab",
          "Medical ICU",
          "Management Office",
          "HCU",
          "Rooftop",
          "Tenant",
          "Medical & Sport Rehab",
          "Chemo Oncology",
          "Kedokteran Nuklir Diagnostik",
          "Kedokteran Nuklir Terapi",
          "Cardio Clinic",
          "Infectious Wards",
          "Ortho Neuro Clinic",
          "Auditorium",
          "Wards",
          "Dialisis",
          "Farmasi Warehouse/IPD",
          "CSSD",
          "LDS",
          "Gastro & Hepato Clinic",
          "Endoscopy Clinic",
          "Pediatric Clinic",
          "Women Clinic",
          "Radiotherapy",
          "Radiologi",
          "MCU",
          "Lobby Utama",
          "Bussines Office",
          "Farmasi OPD",
          "Segara Clinic",
          "Cemara Clinic",
          "Dental Clinic",
          "CCTV",
          "Receiving",
          "FCC",
          "Laundry",
          "Workshop",
          "Manajemen Office",
          "International Clinic",
          "Kitchen",
        ].map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="area"
              value={opt}
              checked={form.area === opt}
              onChange={(e) => handleChange("area", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
        <label className="block">
          <input
            type="radio"
            name="area"
            value="lainnya"
            checked={form.area === "lainnya"}
            onChange={() => handleChange("area", "lainnya")}
          />{" "}
          Lainnya:
          {form.area === "lainnya" && (
            <input
              type="text"
              value={form.areaLain}
              onChange={(e) => handleChange("areaLain", e.target.value)}
              className="ml-2 border rounded p-1"
            />
          )}
        </label>
      </div>

      {/* Gedung */}
      <div>
        <label className="block font-semibold">Gedung *</label>
        {["A", "B", "C", "D", "E", "F"].map((opt) => (
          <label key={opt} className="mr-4">
            <input
              type="radio"
              name="gedung"
              value={opt}
              checked={form.gedung === opt}
              onChange={(e) => handleChange("gedung", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>

      {/* Lantai */}
      <div>
        <label className="block font-semibold">Lantai *</label>
        {["1", "2", "3", "4", "Atap"].map((opt) => (
          <label key={opt} className="mr-4">
            <input
              type="radio"
              name="lantai"
              value={opt}
              checked={form.lantai === opt}
              onChange={(e) => handleChange("lantai", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>

      {/* Tanggal Pemeriksaan */}
      <div>
        <label className="block font-semibold">Tanggal Pemeriksaan *</label>
        <input
          type="date"
          value={form.tglPemeriksaan}
          onChange={(e) => handleChange("tglPemeriksaan", e.target.value)}
          className="mt-1 w-full border rounded p-2"
          required
        />
      </div>

      {/* Masa Berlaku */}
      <div>
        <label className="block font-semibold">Masa Berlaku *</label>

        <div className="flex flex-col gap-2">
          {/* Radio Tanggal */}
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="masaBerlakuOption"
              value="tanggal"
              checked={masaBerlakuOption === "tanggal"}
              onChange={() => setMasaBerlakuOption("tanggal")}
            />
            <span>Tanggal</span>
          </label>

          {masaBerlakuOption === "tanggal" && (
            <input
              type="date"
              value={form.masaBerlaku}
              onChange={(e) => setForm({ ...form, masaBerlaku: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            />
          )}

          {/* Radio Lainnya */}
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="masaBerlakuOption"
              value="lainnya"
              checked={masaBerlakuOption === "lainnya"}
              onChange={() => {
                setMasaBerlakuOption("lainnya");
                setForm({ ...form, masaBerlaku: "" }); // kosongkan
              }}
            />
            <span>Lainnya</span>
          </label>
        </div>
      </div>

      {/* Status Kepemilikan */}
      <div>
        <label className="block font-semibold">Status Kepemilikan *</label>
        {["HSE", "Unit"].map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="status"
              value={opt}
              checked={form.status === opt}
              onChange={(e) => handleChange("status", e.target.value)}
            />{" "}
            {opt}
          </label>
        ))}
        <label className="block">
          <input
            type="radio"
            name="status"
            value="lainnya"
            checked={form.status === "lainnya"}
            onChange={() => handleChange("status", "lainnya")}
          />{" "}
          Lainnya:
          {form.status === "lainnya" && (
            <input
              type="text"
              value={form.statusLain}
              onChange={(e) => handleChange("statusLain", e.target.value)}
              className="ml-2 border rounded p-1"
            />
          )}
        </label>
      </div>

      {/* Keterangan */}
      <div>
        <label className="block font-semibold">Keterangan</label>
        <textarea
          value={form.keterangan}
          onChange={(e) => handleChange("keterangan", e.target.value)}
          className="mt-1 w-full border rounded p-2"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simpan
      </button>
    </form>
  );
}