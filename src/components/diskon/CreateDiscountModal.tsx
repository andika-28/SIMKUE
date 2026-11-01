import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Tag,
  AlertCircle,
  CheckCircle2,
  Users,
  Building2,
  Utensils,
  GraduationCap,
  Calculator,
  UserCheck,
  Search,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  BillingDiscount,
  DiscountBillingType,
  DiscountType,
  DiscountTargetScope,
  MealPackageType,
  StudentUnit,
  StudentClass,
} from '../../types';
import { standardBillingRates, studentCountByTarget } from '../../data/discountData';
import { initialStudents } from '../../data/studentsData';

interface CreateDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDiscount: (discount: Omit<BillingDiscount, 'id' | 'no' | 'tanggalDibuat'>, asActive: boolean) => void;
  initialData?: BillingDiscount | null;
}

export const CreateDiscountModal: React.FC<CreateDiscountModalProps> = ({
  isOpen,
  onClose,
  onSaveDiscount,
  initialData,
}) => {
  // Form states
  const [tahunAjaran, setTahunAjaran] = useState('2026 / 2027');
  const [periode, setPeriode] = useState('Agustus 2026');
  const [namaDiskon, setNamaDiskon] = useState('');
  const [jenisTagihan, setJenisTagihan] = useState<DiscountBillingType>('Uang Makan');
  const [tipeDiskon, setTipeDiskon] = useState<DiscountType>('Nominal Tetap');
  const [nominalDiskon, setNominalDiskon] = useState<number>(150000);
  const [persentaseDiskon, setPersentaseDiskon] = useState<number>(25);
  const [targetDiskon, setTargetDiskon] = useState<DiscountTargetScope>('Paket Makan');
  
  // Specific targets
  const [targetPaketMakan, setTargetPaketMakan] = useState<MealPackageType>('Paket C');
  const [targetUnit, setTargetUnit] = useState<StudentUnit>('MTs');
  const [targetKelas, setTargetKelas] = useState<StudentClass>('Kelas 1');
  const [selectedStudentNis, setSelectedStudentNis] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Reason and notes
  const [alasan, setAlasan] = useState(
    'Diskon diberikan karena kegiatan belajar dan konsumsi pesantren tidak berjalan penuh selama bulan Agustus 2026.'
  );
  const [catatanInternal, setCatatanInternal] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync initial data if editing
  useEffect(() => {
    if (initialData) {
      setTahunAjaran(initialData.tahunAjaran);
      setPeriode(initialData.periode);
      setNamaDiskon(initialData.namaDiskon);
      setJenisTagihan(initialData.jenisTagihan);
      setTipeDiskon(initialData.tipeDiskon);
      setNominalDiskon(initialData.nominalDiskon);
      if (initialData.persentaseDiskon) setPersentaseDiskon(initialData.persentaseDiskon);
      setTargetDiskon(initialData.targetDiskon);
      if (initialData.targetPaketMakan) setTargetPaketMakan(initialData.targetPaketMakan);
      if (initialData.targetUnit) setTargetUnit(initialData.targetUnit);
      if (initialData.targetKelas) setTargetKelas(initialData.targetKelas);
      if (initialData.targetSantriNisList) setSelectedStudentNis(initialData.targetSantriNisList);
      setAlasan(initialData.alasan);
      setCatatanInternal(initialData.catatanInternal || '');
    } else {
      // Default initial state
      setNamaDiskon('Diskon Makan Libur Akhir Bulan');
      setNominalDiskon(150000);
      setJenisTagihan('Uang Makan');
      setTargetDiskon('Paket Makan');
      setTargetPaketMakan('Paket C');
    }
  }, [initialData, isOpen]);

  // Determine Normal Rate based on current selection
  const nominalNormal = useMemo(() => {
    if (jenisTagihan === 'Uang Makan') {
      if (targetDiskon === 'Paket Makan') {
        return standardBillingRates.uangMakan[targetPaketMakan] || 600000;
      }
      return 600000; // default average/C
    } else if (jenisTagihan === 'SPP') {
      if (targetDiskon === 'Unit') {
        return standardBillingRates.spp[targetUnit] || 200000;
      }
      return 200000;
    } else {
      return standardBillingRates.listrikAir.default;
    }
  }, [jenisTagihan, targetDiskon, targetPaketMakan, targetUnit]);

  // Calculated Effective Discount Nominal
  const effectiveNominalDiskon = useMemo(() => {
    if (tipeDiskon === 'Nominal Tetap') {
      return nominalDiskon;
    } else {
      return Math.round((nominalNormal * (persentaseDiskon || 0)) / 100);
    }
  }, [tipeDiskon, nominalDiskon, persentaseDiskon, nominalNormal]);

  // Calculated Final Rate
  const nominalAkhir = Math.max(0, nominalNormal - effectiveNominalDiskon);

  // Calculated affected student count
  const santriTerdampakCount = useMemo(() => {
    switch (targetDiskon) {
      case 'Semua Santri':
        return studentCountByTarget.semuaSantri;
      case 'Paket Makan':
        return studentCountByTarget.paketMakan[targetPaketMakan] || 0;
      case 'Unit':
        return studentCountByTarget.unit[targetUnit] || 0;
      case 'Kelas':
        return studentCountByTarget.kelas[targetKelas] || 0;
      case 'Santri Tertentu':
        return selectedStudentNis.length;
      default:
        return 0;
    }
  }, [targetDiskon, targetPaketMakan, targetUnit, targetKelas, selectedStudentNis]);

  // Estimated Total Discount
  const estimasiTotalDiskon = effectiveNominalDiskon * santriTerdampakCount;

  // Compute Target Detail String
  const targetDetail = useMemo(() => {
    switch (targetDiskon) {
      case 'Semua Santri':
        return 'Semua Santri';
      case 'Paket Makan':
        return targetPaketMakan;
      case 'Unit':
        return targetUnit;
      case 'Kelas':
        return targetKelas;
      case 'Santri Tertentu':
        return `${selectedStudentNis.length} Santri Terpilih`;
      default:
        return 'Semua Santri';
    }
  }, [targetDiskon, targetPaketMakan, targetUnit, targetKelas, selectedStudentNis]);

  // Filter students for 'Santri Tertentu' search
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return initialStudents.slice(0, 10);
    const q = studentSearch.toLowerCase();
    return initialStudents.filter(
      (s) =>
        s.nama.toLowerCase().includes(q) ||
        s.nis.toLowerCase().includes(q) ||
        s.kelas.toLowerCase().includes(q)
    );
  }, [studentSearch]);

  const toggleStudentSelection = (nis: string) => {
    setSelectedStudentNis((prev) =>
      prev.includes(nis) ? prev.filter((id) => id !== nis) : [...prev, nis]
    );
  };

  // Validation Logic
  const handleValidateAndSubmit = (asActive: boolean) => {
    if (!namaDiskon.trim()) {
      setValidationError('Nama diskon wajib diisi.');
      return;
    }
    if (effectiveNominalDiskon <= 0) {
      setValidationError('Nominal diskon harus lebih dari Rp 0.');
      return;
    }
    if (effectiveNominalDiskon > nominalNormal) {
      setValidationError(
        `Nominal diskon (${formatRupiah(effectiveNominalDiskon)}) tidak boleh melebihi nominal normal tagihan (${formatRupiah(nominalNormal)}).`
      );
      return;
    }
    if (targetDiskon === 'Santri Tertentu' && selectedStudentNis.length === 0) {
      setValidationError('Pilih minimal 1 santri untuk target Santri Tertentu.');
      return;
    }
    if (!alasan.trim()) {
      setValidationError('Alasan pemberian diskon wajib diisi untuk kepatuhan audit.');
      return;
    }

    setValidationError(null);

    onSaveDiscount(
      {
        periode,
        tahunAjaran,
        namaDiskon: namaDiskon.trim(),
        jenisTagihan,
        tipeDiskon,
        targetDiskon,
        targetDetail,
        targetPaketMakan: targetDiskon === 'Paket Makan' ? targetPaketMakan : undefined,
        targetUnit: targetDiskon === 'Unit' ? targetUnit : undefined,
        targetKelas: targetDiskon === 'Kelas' ? targetKelas : undefined,
        targetSantriNisList: targetDiskon === 'Santri Tertentu' ? selectedStudentNis : undefined,
        nominalDiskon: effectiveNominalDiskon,
        persentaseDiskon: tipeDiskon === 'Persentase' ? persentaseDiskon : undefined,
        nominalNormal,
        nominalAkhir,
        santriTerdampakCount,
        estimasiTotalDiskon,
        status: asActive ? 'AKTIF' : 'DRAFT',
        alasan: alasan.trim(),
        catatanInternal: catatanInternal.trim() || undefined,
        dibuatOleh: 'Administrator',
        isBillingGenerated: false,
      },
      asActive
    );
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div
        id="modal-create-discount"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Diskon Tagihan' : 'Buat Diskon Baru'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi diskon manual untuk periode tagihan tertentu tanpa mengubah tarif master.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-create-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 scrollbar-thin">
          {/* LEFT COLUMN: 4 Form Sections (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Validation alert banner if any error */}
            {validationError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 font-semibold animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* SECTION 1: Periode */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Periode Tagihan
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tahun Ajaran
                  </label>
                  <select
                    id="input-create-discount-academic-year"
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="2026 / 2027">2026 / 2027</option>
                    <option value="2025 / 2026">2025 / 2026</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Bulan Periode Tagihan
                  </label>
                  <select
                    id="input-create-discount-period"
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="Agustus 2026">Agustus 2026 (Aktif)</option>
                    <option value="September 2026">September 2026</option>
                    <option value="Juli 2026">Juli 2026</option>
                    <option value="Juni 2026">Juni 2026</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Diskon hanya berlaku untuk periode yang dipilih dan tidak bersifat permanen.</span>
              </div>
            </div>

            {/* SECTION 2: Informasi Diskon */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Informasi & Nominal Diskon
                </h4>
              </div>

              {/* Nama Diskon */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Diskon <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-create-discount-name"
                  value={namaDiskon}
                  onChange={(e) => setNamaDiskon(e.target.value)}
                  placeholder="Contoh: Diskon Makan Libur Akhir Bulan"
                  className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#064E3B] font-semibold"
                />
              </div>

              {/* Jenis Tagihan & Tipe Diskon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jenis Tagihan
                  </label>
                  <select
                    id="input-create-discount-type"
                    value={jenisTagihan}
                    onChange={(e) => setJenisTagihan(e.target.value as DiscountBillingType)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="Uang Makan">Uang Makan</option>
                    <option value="SPP">SPP</option>
                    <option value="Listrik & Air">Listrik & Air</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tipe Diskon
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="tipeDiskon"
                        value="Nominal Tetap"
                        checked={tipeDiskon === 'Nominal Tetap'}
                        onChange={() => setTipeDiskon('Nominal Tetap')}
                        className="text-[#064E3B] focus:ring-[#064E3B]"
                      />
                      Nominal Tetap (Rp)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="tipeDiskon"
                        value="Persentase"
                        checked={tipeDiskon === 'Persentase'}
                        onChange={() => setTipeDiskon('Persentase')}
                        className="text-[#064E3B] focus:ring-[#064E3B]"
                      />
                      Persentase (%)
                    </label>
                  </div>
                </div>
              </div>

              {/* Input Value */}
              <div>
                {tipeDiskon === 'Nominal Tetap' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nominal Diskon (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Rp
                      </span>
                      <input
                        type="number"
                        id="input-create-discount-nominal"
                        value={nominalDiskon || ''}
                        onChange={(e) => setNominalDiskon(Number(e.target.value))}
                        step="5000"
                        min="0"
                        max={nominalNormal}
                        className="w-full text-xs font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#064E3B]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Persentase Diskon (%) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="input-create-discount-percent"
                        value={persentaseDiskon || ''}
                        onChange={(e) => setPersentaseDiskon(Number(e.target.value))}
                        min="1"
                        max="100"
                        className="w-full text-xs font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-[#064E3B]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        %
                      </span>
                    </div>
                  </div>
                )}

                {/* Validation notice */}
                {effectiveNominalDiskon > nominalNormal ? (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      Nominal diskon tidak boleh melebihi tarif normal ({formatRupiah(nominalNormal)}).
                    </span>
                  </div>
                ) : (
                  <div className="mt-1.5 text-[11px] text-slate-500">
                    Tarif normal: <strong className="text-slate-700">{formatRupiah(nominalNormal)}</strong> • Diskon: <strong className="text-emerald-700">-{formatRupiah(effectiveNominalDiskon)}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Target Diskon (Berlaku Untuk) */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Diskon (Berlaku Untuk)
                </h4>
              </div>

              {/* Target Options Pills / Radio grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Semua Santri', label: 'Semua Santri', icon: Users, sub: '265 Santri' },
                  { id: 'Paket Makan', label: 'Paket Makan', icon: Utensils, sub: 'Paket A/B/C' },
                  { id: 'Unit', label: 'Unit', icon: Building2, sub: 'MTs / MA' },
                  { id: 'Kelas', label: 'Kelas', icon: GraduationCap, sub: 'Kelas 1-6' },
                  { id: 'Santri Tertentu', label: 'Santri Tertentu', icon: UserCheck, sub: 'Pilih Manual' },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = targetDiskon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetDiskon(item.id as DiscountTargetScope)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-[#064E3B] ring-1 ring-[#064E3B]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <IconComp
                          className={`w-4 h-4 ${isSelected ? 'text-[#064E3B]' : 'text-slate-400'}`}
                        />
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#064E3B]" />}
                      </div>
                      <div className="mt-1.5">
                        <div className={`text-xs font-bold ${isSelected ? 'text-[#064E3B]' : 'text-slate-800'}`}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Target Sub-selection based on scope */}
              {targetDiskon === 'Paket Makan' && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Pilih Paket Makan:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Paket A', 'Paket B', 'Paket C'] as MealPackageType[]).map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => setTargetPaketMakan(pkg)}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          targetPaketMakan === pkg
                            ? 'bg-[#064E3B] text-white border-[#064E3B]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pkg}
                        <span className="block text-[10px] font-normal opacity-80">
                          {studentCountByTarget.paketMakan[pkg]} Santri
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {targetDiskon === 'Unit' && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Pilih Unit Sekolah:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['MTs', 'MA'] as StudentUnit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setTargetUnit(u)}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          targetUnit === u
                            ? 'bg-[#064E3B] text-white border-[#064E3B]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Unit {u}
                        <span className="block text-[10px] font-normal opacity-80">
                          {studentCountByTarget.unit[u]} Santri
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {targetDiskon === 'Kelas' && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Pilih Kelas:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {(['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'] as StudentClass[]).map(
                      (k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setTargetKelas(k)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all ${
                            targetKelas === k
                              ? 'bg-[#064E3B] text-white border-[#064E3B]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {k}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {targetDiskon === 'Santri Tertentu' && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Pilih Santri Terpilih:
                    </label>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {selectedStudentNis.length} Dipilih
                    </span>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Cari nama atau NIS santri..."
                      className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>

                  {/* Student checkbox list */}
                  <div className="max-h-36 overflow-y-auto space-y-1 border border-slate-100 rounded-lg p-1.5 scrollbar-thin">
                    {filteredStudents.map((s) => {
                      const isChecked = selectedStudentNis.includes(s.nis);
                      return (
                        <div
                          key={s.nis}
                          onClick={() => toggleStudentSelection(s.nis)}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            isChecked ? 'bg-emerald-50 text-[#064E3B]' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded text-[#064E3B] focus:ring-[#064E3B]"
                            />
                            <span className="font-semibold">{s.nama}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {s.nis} • {s.kelas}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: Keterangan & Audit Notes */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Keterangan & Catatan Audit
                </h4>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Alasan Diskon (Wajib) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="input-create-discount-reason"
                  rows={2}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Contoh: Diskon diberikan karena kegiatan belajar dan konsumsi pesantren tidak berjalan penuh..."
                  className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catatan Internal Bendahara (Opsional)
                </label>
                <textarea
                  id="input-create-discount-internal-notes"
                  rows={2}
                  value={catatanInternal}
                  onChange={(e) => setCatatanInternal(e.target.value)}
                  placeholder="Catatan verifikasi, nomor surat keputusan pimpinan, dsb..."
                  className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Simulation Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Simulasi Diskon
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-200 bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
                  Live Preview
                </span>
              </div>

              {/* Target & Period Badges */}
              <div className="space-y-2">
                <div className="text-[11px] text-emerald-300">
                  Periode:{' '}
                  <strong className="text-white">
                    {periode} ({tahunAjaran})
                  </strong>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-emerald-900/80 rounded-lg font-semibold border border-emerald-700">
                    Jenis: {jenisTagihan}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-900/80 rounded-lg font-semibold border border-emerald-700">
                    Target: {targetDetail}
                  </span>
                </div>
              </div>

              {/* Calculation Rows */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Nominal Normal:</span>
                  <span className="font-semibold text-white">
                    {formatRupiah(nominalNormal)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-300 font-bold">
                  <span>Diskon:</span>
                  <span className="text-emerald-300 text-sm">
                    - {formatRupiah(effectiveNominalDiskon)}
                    {tipeDiskon === 'Persentase' && ` (${persentaseDiskon}%)`}
                  </span>
                </div>

                {/* Final Bill Result */}
                <div className="pt-3 border-t border-emerald-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      TAGIHAN AKHIR:
                    </span>
                    <span className="text-[10px] text-slate-400">per santri</span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {formatRupiah(nominalAkhir)}
                  </span>
                </div>
              </div>

              {/* Santri & Total Impact Highlight Box */}
              <div className="pt-4 border-t border-emerald-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span>Santri Terdampak:</span>
                  <span className="font-bold text-white bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-700">
                    {santriTerdampakCount} Santri
                  </span>
                </div>

                <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-700/80 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    ESTIMASI TOTAL DISKON
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight mt-1">
                    {formatRupiah(estimasiTotalDiskon)}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 mt-1">
                    ({santriTerdampakCount} santri × {formatRupiah(effectiveNominalDiskon)})
                  </span>
                </div>
              </div>
            </div>

            {/* Quality check note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Diskon ini akan diverifikasi secara otomatis saat batch generate tagihan {periode} dijalankan.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Pastikan seluruh data diskon telah sesuai dengan regulasi kepesantrenan.
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="btn-cancel-create-discount"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              id="btn-save-discount-draft"
              onClick={() => handleValidateAndSubmit(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
            >
              Simpan sebagai Draft
            </button>

            <button
              type="button"
              id="btn-activate-discount-modal-submit"
              onClick={() => handleValidateAndSubmit(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#047857] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Aktifkan Diskon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
