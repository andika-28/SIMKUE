import React, { useState } from 'react';
import {
  Percent,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface SectionDiskonBulananProps {
  onShowToast: (msg: string) => void;
}

export const SectionDiskonBulanan: React.FC<SectionDiskonBulananProps> = ({ onShowToast }) => {
  const [discountMethod, setDiscountMethod] = useState<'manual' | 'automatic'>('manual');
  const [sampleMonth, setSampleMonth] = useState('Desember 2026');
  const [sampleSpp, setSampleSpp] = useState(50000);
  const [sampleMakan, setSampleMakan] = useState(150000);
  const [sampleListrik, setSampleListrik] = useState(10000);

  const defaultTotalC = 200000 + 600000 + 50000; // SPP (200k) + Makan C (600k) + Utilitas (50k) = 850k
  const totalDiscount = sampleSpp + sampleMakan + sampleListrik; // 210k
  const finalTotalC = defaultTotalC - totalDiscount; // 640k

  const handleSavePolicy = () => {
    onShowToast('Aturan dan parameter kebijakan diskon tagihan bulanan berhasil disimpan.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Pengaturan Diskon Tagihan Bulanan</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Konfigurasi potongan tagihan santri ketika kegiatan belajar tidak berlangsung penuh selama 1 bulan kalender (contoh: masa libur semester atau Ramadhan).
        </p>
      </div>

      {/* Method Selection Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-700" />
            Metode Kebijakan Diskon
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            SOP Keuangan Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setDiscountMethod('manual')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              discountMethod === 'manual'
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-emerald-700 flex items-center justify-center">
                  {discountMethod === 'manual' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  )}
                </span>
                Nominal Manual per Komponen (Direkomendasikan)
              </span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md font-extrabold">
                Default SIMKEU
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Administrator atau bendahara menentukan nominal rupiah diskon pada masing-masing komponen tagihan pada bulan tertentu tepat sebelum tagihan digenerate.
            </p>
          </div>

          <div
            onClick={() => setDiscountMethod('automatic')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              discountMethod === 'automatic'
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-slate-400 flex items-center justify-center">
                  {discountMethod === 'automatic' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  )}
                </span>
                Persentase Prorata Hari Aktif
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                Opsi Tambahan
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diskon dihitung otomatis proporsional berdasarkan jumlah hari libur resmi pesantren yang didaftarkan dalam kalender akademik.
            </p>
          </div>
        </div>

        {/* Live Example Simulator */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              Simulasi Contoh Diskon Libur Semester Ganjil ({sampleMonth})
            </span>
            <span className="text-[11px] text-slate-500">Santri Kategori C (Mukim Penuh)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Diskon SPP (Rp)</label>
              <input
                type="number"
                step="5000"
                value={sampleSpp}
                onChange={(e) => setSampleSpp(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Diskon Uang Makan (Rp)</label>
              <input
                type="number"
                step="10000"
                value={sampleMakan}
                onChange={(e) => setSampleMakan(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Diskon Listrik & Air (Rp)</label>
              <input
                type="number"
                step="5000"
                value={sampleListrik}
                onChange={(e) => setSampleListrik(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Audit Verification Table */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Nominal Normal:</span>
                <span className="font-bold text-slate-700">Rp {defaultTotalC.toLocaleString('id-ID')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-[10px] text-red-500 block">Total Potongan Diskon:</span>
                <span className="font-bold text-red-600">- Rp {totalDiscount.toLocaleString('id-ID')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-[10px] text-emerald-600 block">Tagihan Akhir Santri:</span>
                <span className="font-black text-emerald-800 text-sm">
                  Rp {finalTotalC.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md font-semibold">
              ✓ Tercatat di Audit Trail
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSavePolicy}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Simpan Parameter Diskon
          </button>
        </div>
      </div>

      {/* Important Discount Rules */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 text-xs text-slate-700">
        <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          4 Prinsip Penting Tata Kelola Diskon SIMKEU
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-0.5">1. Berlaku Per Periode Penagihan</strong>
            Diskon hanya diaplikasikan pada bulan kalender yang bersangkutan dan tidak otomatis bergulir ke bulan berikutnya.
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-0.5">2. Fleksibilitas Tiap Bulan</strong>
            Besaran potongan dapat berbeda-beda menyesuaikan kalender akademik libur santri (misal: libur penuh vs 2 minggu).
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-0.5">3. Wajib Terdokumentasi Resmi</strong>
            Setiap penetapan diskon harus melalui pencatatan di modul Manajemen Diskon dengan riwayat pembuat (author).
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-0.5">4. Nilai Awal Tetap Tersimpan</strong>
            Struktur kwitansi tetap menampilkan Nominal Awal, Potongan Diskon, dan Nominal Akhir demi transparansi wali santri.
          </div>
        </div>
      </div>
    </div>
  );
};
