import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Upload,
  Calendar,
  Building,
  DollarSign,
  Landmark,
  FileText,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Trash2,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Coins,
  Building2,
  Sparkles,
} from 'lucide-react';
import {
  ExpenseItem,
  ExpenseCategory,
  ExpenseUnit,
  ExpenseAttachment,
  ExpenseInstitutionUnit,
  FundingSourceItem,
} from '../../types';
import {
  initialConfiguredCategories,
  initialInstitutionUnits,
  initialFundingSources,
  getSuggestedFundingSource,
} from '../../data/expenseSettingsData';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<ExpenseItem, 'id' | 'riwayatAktivitas'>, isDraft?: boolean) => void;
  bni1Balance: number;
  bni2Balance: number;
  currentActorName: string;
  availableCategories?: ExpenseCategory[];
  availableUnits?: ExpenseInstitutionUnit[];
  availableFundingSources?: FundingSourceItem[];
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  bni1Balance,
  bni2Balance,
  currentActorName,
  availableCategories = initialConfiguredCategories,
  availableUnits = initialInstitutionUnits,
  availableFundingSources = initialFundingSources,
}) => {
  const activeCategories = availableCategories.filter((c) => c.isActive);
  const activeUnits = availableUnits.filter((u) => u.isActive);
  const activeSources = availableFundingSources.filter((s) => s.isActive);

  // Form States
  const [tanggal, setTanggal] = useState<string>('01 Sep 2026');
  const [transactionNo, setTransactionNo] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Belanja Dapur');
  const [keterangan, setKeterangan] = useState<string>('');
  const [nominalRaw, setNominalRaw] = useState<string>('8500000');
  const [rekening, setRekening] = useState<'BNI Rekening 1' | 'BNI Rekening 2'>('BNI Rekening 1');
  const [sumberDana, setSumberDana] = useState<string>('Kas Dapur & Uang Makan Santri');

  // Submission info (Section 3)
  const [pengajuanOleh, setPengajuanOleh] = useState<string>('Ustadzah Maryam');
  const [unit, setUnit] = useState<ExpenseUnit>('Dapur');
  const [disetujuiOleh, setDisetujuiOleh] = useState<string>('Pimpinan Pesantren (KH. Abdullah Rasyid)');
  const [tanggalPersetujuan, setTanggalPersetujuan] = useState<string>('01 Sep 2026');

  // Attachments (Section 4)
  const [attachments, setAttachments] = useState<ExpenseAttachment[]>([
    {
      id: 'att-mock-1',
      name: 'nota-belanja-dapur.pdf',
      size: '245 KB',
      type: 'pdf',
      uploadDate: '01 Sep 2026, 09:30',
    },
    {
      id: 'att-mock-2',
      name: 'foto-timbangan-beras.jpg',
      size: '1.2 MB',
      type: 'image',
      uploadDate: '01 Sep 2026, 09:32',
    },
  ]);

  // Additional Notes (Section 5)
  const [catatan, setCatatan] = useState<string>('Belanja bahan makanan untuk kebutuhan konsumsi santri satu minggu.');

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Generate Transaction No when opened and set initial recommendation
  useEffect(() => {
    if (isOpen) {
      const randomSeq = Math.floor(100 + Math.random() * 900);
      setTransactionNo(`EXP-20260901-${randomSeq}`);

      const suggestion = getSuggestedFundingSource(
        selectedCategory,
        unit,
        activeCategories,
        activeUnits,
        activeSources
      );
      setSumberDana(suggestion.sourceName);
      setRekening(suggestion.rekeningKas);
    }
  }, [isOpen]);

  const handleCategoryChange = (newCat: string) => {
    setSelectedCategory(newCat);
    const catObj = activeCategories.find((c) => c.name === newCat);
    if (catObj?.defaultUnit) {
      setUnit(catObj.defaultUnit);
    }
    const suggestion = getSuggestedFundingSource(
      newCat,
      catObj?.defaultUnit || unit,
      activeCategories,
      activeUnits,
      activeSources
    );
    setSumberDana(suggestion.sourceName);
    setRekening(suggestion.rekeningKas);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    const matchedUnit = activeUnits.find((u) => u.name === newUnit);
    if (matchedUnit?.penanggungJawab) {
      setPengajuanOleh(matchedUnit.penanggungJawab);
    }
    if (matchedUnit?.sumberDanaUtama) {
      setSumberDana(matchedUnit.sumberDanaUtama);
      const matchedSource = activeSources.find((s) => s.name === matchedUnit.sumberDanaUtama);
      if (matchedSource) {
        setRekening(matchedSource.rekeningKas === 'BNI Rekening 2' ? 'BNI Rekening 2' : 'BNI Rekening 1');
      }
    }
  };

  const handleSourceChange = (newSourceName: string) => {
    setSumberDana(newSourceName);
    const matchedSource = activeSources.find((s) => s.name === newSourceName);
    if (matchedSource) {
      setRekening(matchedSource.rekeningKas === 'BNI Rekening 2' ? 'BNI Rekening 2' : 'BNI Rekening 1');
    }
  };

  if (!isOpen) return null;

  const nominalNumber = parseInt(nominalRaw.replace(/\D/g, '') || '0', 10);
  const currentAccountBalance = rekening === 'BNI Rekening 1' ? bni1Balance : bni2Balance;
  const balanceAfter = currentAccountBalance - nominalNumber;
  const isBalanceInsufficient = nominalNumber > currentAccountBalance;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setNominalRaw(rawVal);
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt: ExpenseAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'image',
        uploadDate: 'Baru saja diupload',
      };
      setAttachments((prev) => [...prev, newAtt]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFinalSubmit = () => {
    const catObj = activeCategories.find((c) => c.name === selectedCategory);
    const statusBukti =
      attachments.length >= 1 ? 'LENGKAP' : 'MENUNGGU_NOTA';

    onSaveExpense(
      {
        transactionNo,
        tanggal,
        kategori: selectedCategory,
        kategoriCode: catObj?.code || 'CAT-EXP',
        keterangan: keterangan.trim() || `Pengeluaran ${selectedCategory}`,
        nominal: nominalNumber,
        rekening,
        sumberKeuangan: sumberDana,
        saldoSebelum: currentAccountBalance,
        saldoSetelah: Math.max(0, balanceAfter),
        buktiList: attachments,
        statusBukti,
        dicatatOleh: currentActorName || 'Bendahara 1 (Ustadz Rahmat)',
        rolePelaksana: 'Bendahara Keuangan',
        pengajuanOleh,
        unit,
        disetujuiOleh,
        tanggalPersetujuan,
        catatan,
        status: 'TERCATAT',
      },
      false
    );

    setShowConfirmModal(false);
    onClose();
  };

  const handleDraftSubmit = () => {
    const catObj = activeCategories.find((c) => c.name === selectedCategory);
    onSaveExpense(
      {
        transactionNo,
        tanggal,
        kategori: selectedCategory,
        kategoriCode: catObj?.code || 'CAT-EXP',
        keterangan: keterangan.trim() || `[Draft] Pengeluaran ${selectedCategory}`,
        nominal: nominalNumber,
        rekening,
        sumberKeuangan: sumberDana,
        saldoSebelum: currentAccountBalance,
        saldoSetelah: Math.max(0, balanceAfter),
        buktiList: attachments,
        statusBukti: attachments.length > 0 ? 'LENGKAP' : 'MENUNGGU_NOTA',
        dicatatOleh: currentActorName || 'Bendahara 1 (Ustadz Rahmat)',
        rolePelaksana: 'Bendahara Keuangan',
        pengajuanOleh,
        unit,
        disetujuiOleh,
        tanggalPersetujuan,
        catatan,
        status: 'DRAFT',
      },
      true
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        id="modal-catat-pengeluaran"
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Catat Pengeluaran Baru
              </h3>
              <p className="text-xs text-slate-500">
                Masukkan informasi transaksi pengeluaran pesantren untuk audit dan pencatatan kas.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-modal-catat"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* SECTION 1 — INFORMASI TRANSAKSI */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Informasi Transaksi
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tanggal */}
                <div>
                  <label htmlFor="create-exp-date" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tanggal Pengeluaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="create-exp-date"
                    type="text"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                {/* Nomor Transaksi */}
                <div>
                  <label htmlFor="create-exp-trxno" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nomor Transaksi (Otomatis)
                  </label>
                  <input
                    id="create-exp-trxno"
                    type="text"
                    value={transactionNo}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono font-bold cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Nomor transaksi dibuat otomatis oleh sistem.
                  </span>
                </div>

                {/* Kategori Pengeluaran */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="create-exp-category" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Kategori Pengeluaran <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Auto-rekomendasi sumber dana
                    </span>
                  </div>
                  <select
                    id="create-exp-category"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:ring-1 focus:ring-[#064E3B] cursor-pointer"
                  >
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} — {c.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Keterangan */}
                <div className="sm:col-span-2">
                  <label htmlFor="create-exp-keterangan" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Keterangan Pengeluaran <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="create-exp-keterangan"
                    rows={2}
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Contoh: Belanja bahan makanan untuk kebutuhan dapur santri..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2 — INFORMASI KEUANGAN & VALIDASI SALDO */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Informasi Keuangan & Sumber Dana
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nominal */}
                <div>
                  <label htmlFor="create-exp-nominal" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nominal Pengeluaran <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 font-mono">
                      Rp
                    </span>
                    <input
                      id="create-exp-nominal"
                      type="text"
                      value={nominalNumber ? nominalNumber.toLocaleString('id-ID') : ''}
                      onChange={handleNominalChange}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-2 text-sm font-black text-slate-900 font-mono focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>

                {/* Sumber Keuangan (Dana) */}
                <div>
                  <label htmlFor="create-exp-sumberdana" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Sumber Keuangan (Dana) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="create-exp-sumberdana"
                    value={sumberDana}
                    onChange={(e) => handleSourceChange(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-1 focus:ring-[#064E3B] cursor-pointer"
                  >
                    {activeSources.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.rekeningKas})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rekening Kas Info Bar */}
                <div className="sm:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-emerald-800 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-700">Akun Rekening Bank Kas: </span>
                        <span className="font-black text-[#064E3B]">{rekening}</span>
                        <span className="text-[11px] text-slate-500 block sm:inline sm:ml-1">
                          (Didebet langsung untuk {sumberDana})
                        </span>
                      </div>
                    </div>
                    <select
                      id="create-exp-rekening"
                      value={rekening}
                      aria-label="Pilih Rekening Kas Debet"
                      onChange={(e) => setRekening(e.target.value as any)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="BNI Rekening 1">BNI Rekening 1 (Operasional & SPP)</option>
                      <option value="BNI Rekening 2">BNI Rekening 2 (Pembangunan & Sarpras)</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Balance Card */}
                <div className="sm:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Saldo Sebelum
                    </span>
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {formatRupiah(currentAccountBalance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase block">
                      Pengeluaran
                    </span>
                    <span className="text-xs font-bold text-rose-600 block truncate">
                      -{formatRupiah(nominalNumber)}
                    </span>
                  </div>
                  <div className={isBalanceInsufficient ? 'bg-rose-50 rounded-lg p-1' : ''}>
                    <span
                      className={`text-[10px] font-bold uppercase block ${
                        isBalanceInsufficient ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      Saldo Setelah
                    </span>
                    <span
                      className={`text-xs font-black block truncate ${
                        isBalanceInsufficient ? 'text-rose-700 font-mono' : 'text-[#064E3B] font-mono'
                      }`}
                    >
                      {formatRupiah(balanceAfter)}
                    </span>
                  </div>
                </div>

                {/* Red Balance Insufficient Alert */}
                {isBalanceInsufficient && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-bold animate-pulse">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Saldo rekening tidak mencukupi untuk transaksi ini.</span>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3 — INFORMASI PENGAJUAN (DOKUMENTASI) */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Informasi Pengajuan (Opsional)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Dokumentasi Proses
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pengajuan Oleh */}
                <div>
                  <label htmlFor="create-exp-pengaju" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Pengajuan Oleh
                  </label>
                  <input
                    id="create-exp-pengaju"
                    type="text"
                    value={pengajuanOleh}
                    onChange={(e) => setPengajuanOleh(e.target.value)}
                    placeholder="Contoh: Ustadz Ahmad"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                {/* Bagian / Unit / Instansi */}
                <div>
                  <label htmlFor="create-exp-unit" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Instansi / Unit Pemakai Kas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="create-exp-unit"
                    value={unit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:ring-1 focus:ring-[#064E3B] cursor-pointer"
                  >
                    {activeUnits.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} — {u.keterangan || u.kategori}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Disetujui Oleh */}
                <div>
                  <label htmlFor="create-exp-approver" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Disetujui Oleh
                  </label>
                  <input
                    id="create-exp-approver"
                    type="text"
                    value={disetujuiOleh}
                    onChange={(e) => setDisetujuiOleh(e.target.value)}
                    placeholder="Contoh: Pimpinan Pesantren"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                {/* Tanggal Persetujuan */}
                <div>
                  <label htmlFor="create-exp-appdate" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tanggal Persetujuan
                  </label>
                  <input
                    id="create-exp-appdate"
                    type="text"
                    value={tanggalPersetujuan}
                    onChange={(e) => setTanggalPersetujuan(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * Informasi ini digunakan sebagai dokumentasi proses pengeluaran dan tidak menghambat pencatatan kas langsung oleh Bendahara.
              </p>
            </div>

            {/* SECTION 4 — BUKTI TRANSAKSI (LAMPIRAN) */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center">
                    4
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Lampiran Bukti (Nota, Kwitansi, Struk)
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {attachments.length} / 10 Lampiran
                </span>
              </div>

              {/* Upload Drop Area */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#064E3B] bg-white rounded-xl p-4 text-center transition-colors">
                <input
                  id="file-upload-input"
                  type="file"
                  onChange={handleAddAttachment}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label
                  htmlFor="file-upload-input"
                  className="cursor-pointer block space-y-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto border border-emerald-200">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Upload Nota, Kwitansi atau Bukti Transfer
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Drag & Drop file di sini atau <strong className="text-[#064E3B] underline">Pilih File</strong> (JPG, PNG, PDF maks 10 MB)
                    </span>
                  </div>
                </label>
              </div>

              {/* Uploaded File Cards */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                          <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {att.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {att.size} • {att.uploadDate}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                        title="Hapus lampiran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 5 — CATATAN TAMBAHAN */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center">
                  5
                </span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Catatan Tambahan
                </h4>
              </div>
              <textarea
                id="create-exp-notes"
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Catatan tambahan mengenai transaksi ini..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>
          </div>

          {/* Right Side: Ringkasan Pengeluaran Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-md sticky top-0">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Ringkasan Pengeluaran
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {transactionNo}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Kategori
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {selectedCategory}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Nominal Transaksi
                  </span>
                  <span className="text-xl font-black text-rose-400 font-mono block">
                    {formatRupiah(nominalNumber)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Rekening Sumber
                  </span>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {rekening}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300 text-xs">
                    <span>Saldo Sebelum:</span>
                    <span className="font-mono">{formatRupiah(currentAccountBalance)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400 text-xs font-semibold">
                    <span>Pengeluaran:</span>
                    <span className="font-mono">-{formatRupiah(nominalNumber)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 text-sm font-black pt-1 border-t border-slate-800">
                    <span>Saldo Setelah:</span>
                    <span className="font-mono">{formatRupiah(balanceAfter)}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                  <span>Status Nota: </span>
                  <strong className="text-emerald-400">
                    {attachments.length > 0 ? '✓ Lengkap' : '⚠ Belum Ada'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-save-as-draft"
              onClick={handleDraftSubmit}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Simpan sebagai Draft
            </button>

            <button
              type="button"
              id="btn-confirm-save-expense"
              disabled={isBalanceInsufficient || nominalNumber <= 0}
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Pengeluaran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            id="modal-konfirmasi-simpan"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Simpan Pengeluaran?
              </h3>
              <p className="text-slate-500">
                Pastikan data transaksi dan nominal pengeluaran sudah benar sebelum dibukukan ke jurnal kas.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori:</span>
                <span className="font-bold text-slate-900">{selectedCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sumber Keuangan (Dana):</span>
                <span className="font-bold text-emerald-800">{sumberDana}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instansi Pemohon:</span>
                <span className="font-bold text-slate-800">{unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-black text-rose-600 font-mono text-sm">
                  {formatRupiah(nominalNumber)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rekening Kas:</span>
                <span className="font-bold text-slate-800">{rekening}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bukti Lampiran:</span>
                <span className="font-bold text-emerald-800">
                  {attachments.length} Dokumen / Foto
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-final-simpan-yes"
                onClick={handleFinalSubmit}
                className="px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-black rounded-xl shadow-xs cursor-pointer"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
