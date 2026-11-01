import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Coins,
  Layers,
  ShieldCheck,
  Landmark,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import {
  ExpenseCategory,
  ExpenseInstitutionUnit,
  FundingSourceItem,
} from '../../types';

interface PengaturanPengeluaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ExpenseCategory[];
  onUpdateCategories: (cats: ExpenseCategory[]) => void;
  institutionUnits: ExpenseInstitutionUnit[];
  onUpdateInstitutionUnits: (units: ExpenseInstitutionUnit[]) => void;
  fundingSources: FundingSourceItem[];
  onUpdateFundingSources: (sources: FundingSourceItem[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

export const PengaturanPengeluaranModal: React.FC<PengaturanPengeluaranModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
  institutionUnits,
  onUpdateInstitutionUnits,
  fundingSources,
  onUpdateFundingSources,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'kategori' | 'instansi' | 'sumber-dana' | 'matriks'>('kategori');

  // Sub-modal state for Category
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catCode, setCatCode] = useState('');
  const [catBudget, setCatBudget] = useState('10000000');
  const [catUnit, setCatUnit] = useState('Umum');
  const [catSource, setCatSource] = useState('Kas Operasional Utama Pesantren');
  const [catDesc, setCatDesc] = useState('');

  // Sub-modal state for Institution Unit
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ExpenseInstitutionUnit | null>(null);
  const [unitName, setUnitName] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [unitCategory, setUnitCategory] = useState<ExpenseInstitutionUnit['kategori']>('Operasional');
  const [unitPIC, setUnitPIC] = useState('');
  const [unitPhone, setUnitPhone] = useState('');
  const [unitBudget, setUnitBudget] = useState('20000000');
  const [unitSource, setUnitSource] = useState('Kas Operasional Utama Pesantren');
  const [unitAccount, setUnitAccount] = useState('BNI Rekening 1');
  const [unitDesc, setUnitDesc] = useState('');

  // Sub-modal state for Funding Source
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<FundingSourceItem | null>(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [sourceType, setSourceType] = useState<FundingSourceItem['tipeDana']>('Kas Operasional');
  const [sourceAccount, setSourceAccount] = useState<FundingSourceItem['rekeningKas']>('BNI Rekening 1');
  const [sourceBalance, setSourceBalance] = useState('50000000');
  const [sourceAnnual, setSourceAnnual] = useState('500000000');
  const [sourceDesc, setSourceDesc] = useState('');

  if (!isOpen) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  // ================= CATEGORY HANDLERS =================
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatCode(`CAT-${Math.floor(10 + Math.random() * 90)}`);
    setCatBudget('10000000');
    setCatUnit(institutionUnits[0]?.name || 'Umum');
    setCatSource(fundingSources[0]?.name || 'Kas Operasional Utama Pesantren');
    setCatDesc('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: ExpenseCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatCode(cat.code);
    setCatBudget((cat.budgetAllocated || 10000000).toString());
    setCatUnit(cat.defaultUnit || 'Umum');
    setCatSource(cat.defaultSumberDana || 'Kas Operasional Utama Pesantren');
    setCatDesc(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      onShowToast('Nama kategori tidak boleh kosong!', 'warn');
      return;
    }

    const budgetNum = parseInt(catBudget.replace(/\D/g, '') || '0', 10);

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: catName.trim(),
              code: catCode.trim().toUpperCase(),
              budgetAllocated: budgetNum,
              defaultUnit: catUnit,
              defaultSumberDana: catSource,
              description: catDesc.trim(),
            }
          : c
      );
      onUpdateCategories(updated);
      onShowToast(`Kategori ${catName} berhasil diperbarui.`);
    } else {
      const newCat: ExpenseCategory = {
        id: `cat-${Date.now()}`,
        code: catCode.trim().toUpperCase() || `CAT-${Date.now().toString().slice(-3)}`,
        name: catName.trim(),
        icon: 'Layers',
        description: catDesc.trim() || `Pos anggaran belanja ${catName}.`,
        isActive: true,
        budgetAllocated: budgetNum,
        defaultUnit: catUnit,
        defaultSumberDana: catSource,
      };
      onUpdateCategories([...categories, newCat]);
      onShowToast(`Kategori ${catName} berhasil ditambahkan.`);
    }
    setIsCategoryModalOpen(false);
  };

  const handleToggleCategoryStatus = (id: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    onUpdateCategories(updated);
    const item = categories.find((c) => c.id === id);
    onShowToast(`Status kategori ${item?.name} diubah menjadi ${!item?.isActive ? 'Aktif' : 'Nonaktif'}.`, 'info');
  };

  // ================= INSTITUTION UNIT HANDLERS =================
  const handleOpenAddUnit = () => {
    setEditingUnit(null);
    setUnitName('');
    setUnitCode(`UNIT-${Math.floor(10 + Math.random() * 90)}`);
    setUnitCategory('Operasional');
    setUnitPIC('');
    setUnitPhone('');
    setUnitBudget('25000000');
    setUnitSource(fundingSources[0]?.name || 'Kas Operasional Utama Pesantren');
    setUnitAccount('BNI Rekening 1');
    setUnitDesc('');
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (unit: ExpenseInstitutionUnit) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setUnitCode(unit.code);
    setUnitCategory(unit.kategori);
    setUnitPIC(unit.penanggungJawab);
    setUnitPhone(unit.kontakPIC || '');
    setUnitBudget(unit.alokasiAnggaranBulanan.toString());
    setUnitSource(unit.sumberDanaUtama);
    setUnitAccount(unit.rekeningDefault || 'BNI Rekening 1');
    setUnitDesc(unit.keterangan || '');
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim() || !unitPIC.trim()) {
      onShowToast('Nama Instansi/Unit dan Penanggung Jawab wajib diisi!', 'warn');
      return;
    }

    const budgetNum = parseInt(unitBudget.replace(/\D/g, '') || '0', 10);

    if (editingUnit) {
      const updated = institutionUnits.map((u) =>
        u.id === editingUnit.id
          ? {
              ...u,
              name: unitName.trim(),
              code: unitCode.trim().toUpperCase(),
              kategori: unitCategory,
              penanggungJawab: unitPIC.trim(),
              kontakPIC: unitPhone.trim(),
              alokasiAnggaranBulanan: budgetNum,
              sumberDanaUtama: unitSource,
              rekeningDefault: unitAccount,
              keterangan: unitDesc.trim(),
            }
          : u
      );
      onUpdateInstitutionUnits(updated);
      onShowToast(`Instansi ${unitName} berhasil diperbarui.`);
    } else {
      const newUnit: ExpenseInstitutionUnit = {
        id: `unit-${Date.now()}`,
        code: unitCode.trim().toUpperCase() || `UNIT-${Date.now().toString().slice(-3)}`,
        name: unitName.trim(),
        kategori: unitCategory,
        penanggungJawab: unitPIC.trim(),
        kontakPIC: unitPhone.trim(),
        alokasiAnggaranBulanan: budgetNum,
        sumberDanaUtama: unitSource,
        rekeningDefault: unitAccount,
        isActive: true,
        keterangan: unitDesc.trim() || `Instansi pengguna dana ${unitName}.`,
      };
      onUpdateInstitutionUnits([...institutionUnits, newUnit]);
      onShowToast(`Instansi ${unitName} berhasil ditambahkan.`);
    }
    setIsUnitModalOpen(false);
  };

  const handleToggleUnitStatus = (id: string) => {
    const updated = institutionUnits.map((u) =>
      u.id === id ? { ...u, isActive: !u.isActive } : u
    );
    onUpdateInstitutionUnits(updated);
    const item = institutionUnits.find((u) => u.id === id);
    onShowToast(`Status instansi ${item?.name} diubah menjadi ${!item?.isActive ? 'Aktif' : 'Nonaktif'}.`, 'info');
  };

  // ================= FUNDING SOURCE HANDLERS =================
  const handleOpenAddSource = () => {
    setEditingSource(null);
    setSourceName('');
    setSourceCode(`SRC-${Math.floor(10 + Math.random() * 90)}`);
    setSourceType('Kas Operasional');
    setSourceAccount('BNI Rekening 1');
    setSourceBalance('50000000');
    setSourceAnnual('600000000');
    setSourceDesc('');
    setIsSourceModalOpen(true);
  };

  const handleOpenEditSource = (src: FundingSourceItem) => {
    setEditingSource(src);
    setSourceName(src.name);
    setSourceCode(src.code);
    setSourceType(src.tipeDana);
    setSourceAccount(src.rekeningKas);
    setSourceBalance(src.saldoTersedia.toString());
    setSourceAnnual((src.paguTahunan || 500000000).toString());
    setSourceDesc(src.deskripsi);
    setIsSourceModalOpen(true);
  };

  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) {
      onShowToast('Nama Sumber Keuangan wajib diisi!', 'warn');
      return;
    }

    const balNum = parseInt(sourceBalance.replace(/\D/g, '') || '0', 10);
    const annNum = parseInt(sourceAnnual.replace(/\D/g, '') || '0', 10);

    if (editingSource) {
      const updated = fundingSources.map((s) =>
        s.id === editingSource.id
          ? {
              ...s,
              name: sourceName.trim(),
              code: sourceCode.trim().toUpperCase(),
              tipeDana: sourceType,
              rekeningKas: sourceAccount,
              saldoTersedia: balNum,
              paguTahunan: annNum,
              deskripsi: sourceDesc.trim(),
            }
          : s
      );
      onUpdateFundingSources(updated);
      onShowToast(`Sumber Keuangan ${sourceName} berhasil diperbarui.`);
    } else {
      const newSource: FundingSourceItem = {
        id: `src-${Date.now()}`,
        code: sourceCode.trim().toUpperCase() || `SRC-${Date.now().toString().slice(-3)}`,
        name: sourceName.trim(),
        tipeDana: sourceType,
        rekeningKas: sourceAccount,
        saldoTersedia: balNum,
        paguTahunan: annNum,
        deskripsi: sourceDesc.trim() || `Sumber dana keuangan ${sourceName}.`,
        isActive: true,
        kategoriPrioritas: ['Operasional'],
        unitPrioritas: ['Umum'],
      };
      onUpdateFundingSources([...fundingSources, newSource]);
      onShowToast(`Sumber Keuangan ${sourceName} berhasil ditambahkan.`);
    }
    setIsSourceModalOpen(false);
  };

  const handleToggleSourceStatus = (id: string) => {
    const updated = fundingSources.map((s) =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    onUpdateFundingSources(updated);
    const item = fundingSources.find((s) => s.id === id);
    onShowToast(`Status sumber dana ${item?.name} diubah menjadi ${!item?.isActive ? 'Aktif' : 'Nonaktif'}.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        id="modal-pengaturan-pengeluaran-sumberdana"
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-xs flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-[#064E3B] to-teal-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-200 shadow-inner">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  Pengaturan Pos, Instansi & Sumber Dana Pengeluaran
                </h2>
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  SIMKEU Pesantren
                </span>
              </div>
              <p className="text-emerald-100/80 text-[11px] mt-0.5">
                Atur kategori pengeluaran, instansi pengguna kas, serta kebijakan penentuan sumber dana pembiayaan.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-pengaturan-pengeluaran"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('kategori')}
            className={`px-3.5 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'kategori'
                ? 'bg-white text-[#064E3B] border-[#064E3B] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-100/80'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Kategori Pengeluaran ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instansi')}
            className={`px-3.5 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'instansi'
                ? 'bg-white text-[#064E3B] border-[#064E3B] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-100/80'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Instansi Pengguna Dana ({institutionUnits.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sumber-dana')}
            className={`px-3.5 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'sumber-dana'
                ? 'bg-white text-[#064E3B] border-[#064E3B] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-100/80'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-700" />
            <span>Sumber Dana Keuangan ({fundingSources.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matriks')}
            className={`px-3.5 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'matriks'
                ? 'bg-white text-[#064E3B] border-[#064E3B] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-100/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <span>Matriks Kebijakan Alokasi Dana</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-white">
          {/* ================= TAB 1: KATEGORI PENGELUARAN ================= */}
          {activeTab === 'kategori' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>Pos Anggaran Kategori Pengeluaran</span>
                    <span className="text-[11px] bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded-md font-semibold">
                      Terhubung Otomatis ke Sumber Dana
                    </span>
                  </h3>
                  <p className="text-slate-600 text-xs">
                    Setiap kategori pengeluaran dipetakan ke Instansi pemohon dan Sumber Dana pembiayaan default agar pencatatan kas keluar akurat dan cepat.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-modal-add-category"
                  onClick={handleOpenAddCategory}
                  className="px-3.5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kategori Baru</span>
                </button>
              </div>

              {/* Categories Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3.5">Nama Pos Belanja</th>
                      <th className="py-3 px-3">Kode Pos</th>
                      <th className="py-3 px-3.5">Instansi Pengguna</th>
                      <th className="py-3 px-3.5">Sumber Dana Default</th>
                      <th className="py-3 px-3.5 text-right">Pagu Bulanan</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3.5 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900">{cat.name}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {cat.code}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-slate-700">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
                            <Building2 className="w-3 h-3 text-teal-600" />
                            {cat.defaultUnit || 'Umum'}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[#064E3B] border border-emerald-200 text-[11px] font-bold">
                            <Coins className="w-3 h-3 text-emerald-700" />
                            {cat.defaultSumberDana || 'Kas Operasional'}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-800">
                          {formatRupiah(cat.budgetAllocated || 0)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCategoryStatus(cat.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              cat.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {cat.isActive ? '✓ Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCategory(cat)}
                              title="Edit Kategori"
                              className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 2: INSTANSI / UNIT ================= */}
          {activeTab === 'instansi' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-200/80">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>Instansi & Unit Pengguna Dana Pesantren</span>
                    <span className="text-[11px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md font-semibold">
                      Otoritas Pengajuan Kas
                    </span>
                  </h3>
                  <p className="text-slate-600 text-xs">
                    Kelola unit kerja pesantren yang berhak mengajukan permohonan belanja, kuota pagu bulanan, dan sumber dana utama yang dialokasikan.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-modal-add-unit"
                  onClick={handleOpenAddUnit}
                  className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Instansi Baru</span>
                </button>
              </div>

              {/* Units Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3.5">Nama Instansi / Unit</th>
                      <th className="py-3 px-3">Kode Unit</th>
                      <th className="py-3 px-3.5">Penanggung Jawab (PIC)</th>
                      <th className="py-3 px-3.5">Sumber Dana Terkait</th>
                      <th className="py-3 px-3.5 text-right">Pagu Bulanan</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3.5 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {institutionUnits.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({u.kategori})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{u.keterangan}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-teal-900">
                          <span className="bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 text-[11px]">
                            {u.code}
                          </span>
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-800">{u.penanggungJawab}</div>
                          {u.kontakPIC && <div className="text-[10px] text-slate-400">{u.kontakPIC}</div>}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[#064E3B] border border-emerald-200 text-[11px] font-bold">
                            <Coins className="w-3 h-3 text-emerald-700" />
                            {u.sumberDanaUtama}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-800">
                          {formatRupiah(u.alokasiAnggaranBulanan)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleUnitStatus(u.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              u.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {u.isActive ? '✓ Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUnit(u)}
                            title="Edit Instansi"
                            className="p-1.5 text-slate-500 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SUMBER DANA ================= */}
          {activeTab === 'sumber-dana' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>Sumber Dana Keuangan (Funding Sources)</span>
                    <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                      Arus Kas Masuk & Pembiayaan
                    </span>
                  </h3>
                  <p className="text-slate-600 text-xs">
                    Tentukan sumber keuangan yang membiayai setiap pos kas keluar pesantren, rekening kas/bank penampung, serta batasan saldo pembiayaan.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-modal-add-source"
                  onClick={handleOpenAddSource}
                  className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Sumber Dana Baru</span>
                </button>
              </div>

              {/* Funding Sources Grid & Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {fundingSources.map((src) => (
                  <div
                    key={src.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      src.isActive
                        ? 'bg-white border-slate-200/90 shadow-xs hover:border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs leading-tight">{src.name}</h4>
                          <span className="font-mono text-[10px] text-slate-400">{src.code}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSource(src)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {src.deskripsi}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider">Rekening Kas</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Landmark className="w-3 h-3 text-slate-400" />
                          {src.rekeningKas}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider">Saldo Alokasi</span>
                        <span className="font-mono font-black text-[#064E3B] text-xs block mt-0.5">
                          {formatRupiah(src.saldoTersedia)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Tipe: {src.tipeDana}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleSourceStatus(src.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          src.isActive ? 'bg-emerald-100 text-[#064E3B]' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {src.isActive ? '✓ Aktif' : 'Nonaktif'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: MATRIKS ALOKASI ================= */}
          {activeTab === 'matriks' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 space-y-2">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
                  <span>Kebijakan & Matriks Otomatisasi Alokasi Sumber Dana</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Sistem SIMKEU menerapkan aturan pemetaan cerdas: Saat Bendahara memilih <strong>Kategori Pengeluaran</strong> dan <strong>Instansi</strong> di formulir kas keluar, sistem secara otomatis merekomendasikan <strong>Sumber Keuangan</strong> dan <strong>Rekening Bank</strong> yang bersesuaian, namun Bendahara tetap memiliki keleluasaan mengubahnya secara manual bila diperlukan.
                </p>
              </div>

              {/* Mapping Overview Grid */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800 text-xs">
                  Ringkasan Pemetaan Kategori → Instansi → Sumber Dana
                </div>
                <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                  {categories.map((c) => {
                    const matchedUnit = institutionUnits.find((u) => u.name === c.defaultUnit);
                    const matchedSource = fundingSources.find((s) => s.name === c.defaultSumberDana);

                    return (
                      <div key={c.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-semibold">
                              {c.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{c.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>{c.defaultUnit || 'Umum'}</span>
                          </span>

                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#064E3B] border border-emerald-200 text-xs font-bold">
                            <Coins className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{c.defaultSumberDana || 'Kas Operasional'}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            <Landmark className="w-3 h-3 text-slate-500" />
                            <span>{matchedSource?.rekeningKas || 'BNI 1'}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan otomatis tersimpan dan berlaku untuk semua formulir pengeluaran.</span>
          </div>

          <button
            type="button"
            id="btn-done-pengaturan-pengeluaran"
            onClick={onClose}
            className="px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-black rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Selesai & Tutup</span>
          </button>
        </div>
      </div>

      {/* ================= SUB-MODAL: FORM TAMBAH / EDIT KATEGORI ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-80 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">
                {editingCategory ? 'Edit Kategori Pengeluaran' : 'Tambah Kategori Pengeluaran'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Misal: Belanja Sayur Santri"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kode Akun</label>
                  <input
                    type="text"
                    value={catCode}
                    onChange={(e) => setCatCode(e.target.value)}
                    placeholder="EXP-XXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pagu Anggaran (Rp)</label>
                  <input
                    type="text"
                    value={parseInt(catBudget || '0', 10).toLocaleString('id-ID')}
                    onChange={(e) => setCatBudget(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Instansi / Unit Pengguna Dana</label>
                <select
                  value={catUnit}
                  onChange={(e) => setCatUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {institutionUnits.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.penanggungJawab})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sumber Dana Keuangan Default</label>
                <select
                  value={catSource}
                  onChange={(e) => setCatSource(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-[#064E3B] focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {fundingSources.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.rekeningKas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deskripsi / Peruntukan</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Keterangan alokasi pos kas keluar..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 resize-none focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: FORM TAMBAH / EDIT INSTANSI ================= */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-80 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">
                {editingUnit ? 'Edit Instansi / Unit' : 'Tambah Instansi / Unit Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsUnitModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="p-5 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Instansi / Unit</label>
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="Misal: Poskestren / Kesehatan"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kode Unit</label>
                  <input
                    type="text"
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    placeholder="UNIT-XXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kategori Unit</label>
                  <select
                    value={unitCategory}
                    onChange={(e) => setUnitCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Asrama & Santri">Asrama & Santri</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Sarpras">Sarpras</option>
                    <option value="Usaha">Usaha</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={unitPIC}
                    onChange={(e) => setUnitPIC(e.target.value)}
                    placeholder="Nama Penanggung Jawab"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kontak PIC</label>
                  <input
                    type="text"
                    value={unitPhone}
                    onChange={(e) => setUnitPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pagu Anggaran (Rp/bln)</label>
                  <input
                    type="text"
                    value={parseInt(unitBudget || '0', 10).toLocaleString('id-ID')}
                    onChange={(e) => setUnitBudget(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Rekening Kas Default</label>
                  <select
                    value={unitAccount}
                    onChange={(e) => setUnitAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="BNI Rekening 1">BNI Rekening 1 (Operasional)</option>
                    <option value="BNI Rekening 2">BNI Rekening 2 (Pembangunan)</option>
                    <option value="Kas Tunai">Kas Tunai Bendahara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sumber Dana Utama</label>
                <select
                  value={unitSource}
                  onChange={(e) => setUnitSource(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-teal-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  {fundingSources.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.rekeningKas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Keterangan Instansi</label>
                <textarea
                  rows={2}
                  value={unitDesc}
                  onChange={(e) => setUnitDesc(e.target.value)}
                  placeholder="Cakupan operasional instansi unit..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 resize-none focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Instansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: FORM TAMBAH / EDIT SUMBER DANA ================= */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-80 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">
                {editingSource ? 'Edit Sumber Keuangan' : 'Tambah Sumber Keuangan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSourceModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSource} className="p-5 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Sumber Keuangan</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Misal: Dana Donasi Wali Santri"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kode Sumber Dana</label>
                  <input
                    type="text"
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    placeholder="SRC-XXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipe Kas</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value="Kas Operasional">Kas Operasional</option>
                    <option value="Kas SPP Santri">Kas SPP Santri</option>
                    <option value="Kas Dapur">Kas Dapur</option>
                    <option value="Dana BOS Kemenag">Dana BOS Kemenag</option>
                    <option value="Infaq & Wakaf">Infaq & Wakaf</option>
                    <option value="Donasi">Donasi</option>
                    <option value="Kas Usaha">Kas Usaha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Rekening Kas Penampung</label>
                  <select
                    value={sourceAccount}
                    onChange={(e) => setSourceAccount(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value="BNI Rekening 1">BNI Rekening 1 (Operasional)</option>
                    <option value="BNI Rekening 2">BNI Rekening 2 (Pembangunan)</option>
                    <option value="Kas Tunai Bendahara">Kas Tunai Bendahara</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Saldo Kas Tersedia (Rp)</label>
                  <input
                    type="text"
                    value={parseInt(sourceBalance || '0', 10).toLocaleString('id-ID')}
                    onChange={(e) => setSourceBalance(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pagu Anggaran Tahunan (Rp)</label>
                <input
                  type="text"
                  value={parseInt(sourceAnnual || '0', 10).toLocaleString('id-ID')}
                  onChange={(e) => setSourceAnnual(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deskripsi & Kebijakan Penggunaan</label>
                <textarea
                  rows={2}
                  value={sourceDesc}
                  onChange={(e) => setSourceDesc(e.target.value)}
                  placeholder="Kriteria dan batasan penggunaan dana..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 resize-none focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSourceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Sumber Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
