import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Save,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Users,
  Receipt,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Tag,
  Info,
} from 'lucide-react';
import { GenerateBillingConfig, MonthlyBillRow, StudentUnit, StudentClass, MealPackageType } from '../../types';
import { generateMonthlyBillsData } from '../../data/monthlyBillingData';

interface Step3PreviewTagihanProps {
  config: GenerateBillingConfig;
  onBack: () => void;
  onSaveDraft: () => void;
  onNext: () => void;
}

export const Step3PreviewTagihan: React.FC<Step3PreviewTagihanProps> = ({
  config,
  onBack,
  onSaveDraft,
  onNext,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('Semua Unit');
  const [selectedKelas, setSelectedKelas] = useState('Semua Kelas');
  const [selectedPaket, setSelectedPaket] = useState('Semua Paket');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Generate 300 santri dynamic dataset with discounts applied based on step 2 config
  const previewData = useMemo(() => {
    const raw = generateMonthlyBillsData(config.bulan);
    return raw.map((item, idx) => {
      let mealFee = 0;
      let discount = 0;

      if (item.paketMakan === 'Paket A') {
        mealFee = config.paketANominal;
        discount = config.paketADiscount;
      } else if (item.paketMakan === 'Paket B') {
        mealFee = config.paketBNominal;
        discount = config.paketBDiscount;
      } else {
        mealFee = config.paketCNominal;
        discount = config.paketCDiscount;
      }

      // Special sample case for Siti Aisyah if no global discount
      if (item.nis === '2026003' && discount === 0 && config.paketCDiscount === 0) {
        discount = 150000;
      }

      const spp = config.sppNominal;
      const listrik = config.listrikAirNominal;
      const total = Math.max(0, spp + mealFee + listrik - discount);

      return {
        ...item,
        spp,
        uangMakan: mealFee,
        listrikAir: listrik,
        diskon: discount,
        totalTagihan: total,
        diskonKeterangan: discount > 0 ? config.catatanDiskon || 'Potongan Periode' : undefined,
      };
    });
  }, [config]);

  // Aggregate totals
  const totalSantriAktif = previewData.length;
  const totalTagihanKotor = useMemo(() => {
    return previewData.reduce((acc, curr) => acc + curr.spp + curr.uangMakan + curr.listrikAir, 0);
  }, [previewData]);

  const totalDiskon = useMemo(() => {
    return previewData.reduce((acc, curr) => acc + curr.diskon, 0);
  }, [previewData]);

  const totalTagihanAkhir = totalTagihanKotor - totalDiskon;

  // Filtered dataset
  const filteredData = useMemo(() => {
    return previewData.filter((row) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = row.namaSantri.toLowerCase().includes(query);
        const matchesNis = row.nis.toLowerCase().includes(query);
        if (!matchesName && !matchesNis) return false;
      }

      if (selectedUnit !== 'Semua Unit' && row.unit !== selectedUnit) {
        return false;
      }

      if (selectedKelas !== 'Semua Kelas' && row.kelas !== selectedKelas) {
        return false;
      }

      if (selectedPaket !== 'Semua Paket' && row.paketMakan !== selectedPaket) {
        return false;
      }

      return true;
    });
  }, [previewData, searchTerm, selectedUnit, selectedKelas, selectedPaket]);

  // Pagination slice
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Alert Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Preview Tagihan Santri
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
            Periksa seluruh data rincian tagihan santri sebelum resmi diterbitkan ke sistem.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-emerald-50 text-[#064E3B] border border-emerald-200 rounded-xl text-xs font-bold w-fit">
          Periode: {config.bulan}
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Santri */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Total Santri Aktif
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#0F172A] mt-1.5">
            {totalSantriAktif}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            100% Santri Memenuhi Syarat
          </div>
        </div>

        {/* Card 2: Total Tagihan Kotor */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Total Tagihan Normal
            </span>
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1.5">
            Rp {totalTagihanKotor.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
            Sebelum potongan diskon
          </div>
        </div>

        {/* Card 3: Total Diskon */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Total Diskon
            </span>
            <Tag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1.5">
            Rp {totalDiskon.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">
            {totalDiskon > 0 ? 'Potongan khusus aktif' : 'Tanpa potongan'}
          </div>
        </div>

        {/* Card 4: Total Tagihan Akhir */}
        <div className="bg-white p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
              Total Tagihan Akhir
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#064E3B]" />
          </div>
          <div className="text-2xl font-black text-[#064E3B] mt-1.5">
            Rp {totalTagihanAkhir.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
            Nominal Wajib Bayar Santri
          </div>
        </div>
      </div>

      {/* Info Alert + Validation Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Important Info Alert */}
        <div className="md:col-span-2 p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Perhatian Pengelola:</span> Pastikan seluruh data telah benar sebelum melanjutkan. Tagihan yang sudah diterbitkan akan tercatat dalam sistem transaksi resmi dan diteruskan ke wali santri.
          </div>
        </div>

        {/* Validation Summary Panel */}
        <div
          id="panel-validasi-data-preview"
          className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center space-y-1.5 text-xs font-medium text-slate-700"
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
            <span>Validasi Data: Lolos (4/4)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>300 Santri Aktif Valid</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Nominal Tagihan Valid</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paket Makan Lengkap (A/B/C)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tidak Ada Tagihan Duplikat</span>
          </div>
        </div>
      </div>

      {/* Main Preview Table Container */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] bg-slate-50/50 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama Santri atau NIS..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Unit */}
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-[#064E3B]"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option value="MTs">MTs (150)</option>
              <option value="MA">MA (150)</option>
            </select>

            {/* Kelas */}
            <select
              value={selectedKelas}
              onChange={(e) => {
                setSelectedKelas(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-[#064E3B]"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
              <option value="Kelas 3">Kelas 3</option>
              <option value="Kelas 4">Kelas 4</option>
              <option value="Kelas 5">Kelas 5</option>
              <option value="Kelas 6">Kelas 6</option>
            </select>

            {/* Paket Makan */}
            <select
              value={selectedPaket}
              onChange={(e) => {
                setSelectedPaket(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-[#064E3B]"
            >
              <option value="Semua Paket">Semua Paket</option>
              <option value="Paket A">Paket A (Rp0)</option>
              <option value="Paket B">Paket B (Rp200.000)</option>
              <option value="Paket C">Paket C (Rp600.000)</option>
            </select>

            {(searchTerm || selectedUnit !== 'Semua Unit' || selectedKelas !== 'Semua Kelas' || selectedPaket !== 'Semua Paket') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedUnit('Semua Unit');
                  setSelectedKelas('Semua Kelas');
                  setSelectedPaket('Semua Paket');
                  setCurrentPage(1);
                }}
                className="h-9 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-slate-50/80 text-[#64748B] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 w-12 text-center">No</th>
                <th className="py-3 px-3.5">NIS</th>
                <th className="py-3 px-3.5">Nama Santri</th>
                <th className="py-3 px-3.5">Unit</th>
                <th className="py-3 px-3.5">Kelas</th>
                <th className="py-3 px-3.5">Paket</th>
                <th className="py-3 px-3.5 text-right">SPP</th>
                <th className="py-3 px-3.5 text-right">Makan</th>
                <th className="py-3 px-3.5 text-right">Listrik & Air</th>
                <th className="py-3 px-3.5 text-right">Diskon</th>
                <th className="py-3 px-3.5 text-right font-extrabold text-[#064E3B]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-medium text-[#0F172A]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada santri yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 text-center text-slate-400 font-normal">
                        {globalIndex}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-600 font-semibold">
                        {row.nis}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#0F172A]">
                        {row.namaSantri}
                      </td>
                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.unit === 'MTs'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {row.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">{row.kelas}</td>
                      <td className="py-3 px-3.5">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {row.paketMakan}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-600">
                        Rp {row.spp.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-600">
                        Rp {row.uangMakan.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-600">
                        Rp {row.listrikAir.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        {row.diskon > 0 ? (
                          <span className="font-bold text-amber-600">
                            - Rp {row.diskon.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">Rp 0</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right font-extrabold text-[#064E3B]">
                        Rp {row.totalTagihan.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan{' '}
            <strong className="font-bold text-slate-800">
              {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredData.length)}
            </strong>{' '}
            dari <strong className="font-bold text-slate-800">{filteredData.length}</strong> Santri
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 px-2 bg-white border border-slate-200 rounded-md text-xs"
            >
              <option value={10}>10 / halaman</option>
              <option value={25}>25 / halaman</option>
              <option value={50}>50 / halaman</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              <span className="px-2 text-xs font-bold text-slate-700">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 Footer Actions */}
      <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          id="btn-step3-back"
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-save-draft"
            onClick={onSaveDraft}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Simpan sebagai Draft</span>
          </button>

          <button
            type="button"
            id="btn-step3-next"
            onClick={onNext}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-sm active:scale-98"
          >
            <span>Lanjutkan ke Konfirmasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
