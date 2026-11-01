import React from 'react';
import {
  Building2,
  Calendar,
  Layers,
  GraduationCap,
  Utensils,
  Receipt,
  Percent,
  TrendingDown,
  Landmark,
  FileCode,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  History,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export type SettingsSectionId =
  | 'identitas'
  | 'tahun-ajaran'
  | 'semester'
  | 'unit-kelas'
  | 'paket-makan'
  | 'jenis-tagihan'
  | 'diskon'
  | 'kategori-pengeluaran'
  | 'rekening-bank'
  | 'penomoran'
  | 'pembayaran'
  | 'laporan'
  | 'keamanan';

interface SettingsNavProps {
  activeSection: SettingsSectionId;
  onSelectSection: (section: SettingsSectionId) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  hasUnsavedChanges?: boolean;
}

export const SettingsNavPanel: React.FC<SettingsNavProps> = ({
  activeSection,
  onSelectSection,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  hasUnsavedChanges = false,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = React.useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const handleSearchChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  const menuItems: {
    id: SettingsSectionId;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: 'identitas',
      label: 'Identitas Pesantren',
      description: 'Nama, logo, kop dokumen, alamat & pimpinan',
      icon: Building2,
    },
    {
      id: 'tahun-ajaran',
      label: 'Tahun Ajaran',
      description: 'Periode aktif 2026/2027 & penutupan buku',
      icon: Calendar,
      badge: 'Aktif',
    },
    {
      id: 'semester',
      label: 'Semester',
      description: 'Semester Ganjil & Genap',
      icon: Layers,
    },
    {
      id: 'unit-kelas',
      label: 'Unit & Struktur Kelas',
      description: 'MTs (1–3) dan MA (4–6)',
      icon: GraduationCap,
    },
    {
      id: 'paket-makan',
      label: 'Paket Makan Santri',
      description: 'Tarif Kategori A, B, dan C',
      icon: Utensils,
    },
    {
      id: 'jenis-tagihan',
      label: 'Jenis & Nominal Tagihan',
      description: 'Tagihan bulanan & tahunan',
      icon: Receipt,
    },
    {
      id: 'diskon',
      label: 'Pengaturan Diskon',
      description: 'Aturan potongan libur bulanan',
      icon: Percent,
    },
    {
      id: 'kategori-pengeluaran',
      label: 'Kategori Pengeluaran',
      description: 'Pos anggaran & perlindungan arsip',
      icon: TrendingDown,
    },
    {
      id: 'rekening-bank',
      label: 'Rekening Bank',
      description: 'Rekening BNI resmi pesantren',
      icon: Landmark,
      badge: '2 Bank',
    },
    {
      id: 'penomoran',
      label: 'Penomoran Dokumen',
      description: 'Format nomor otomatis transaksi',
      icon: FileCode,
    },
    {
      id: 'pembayaran',
      label: 'Pengaturan Pembayaran',
      description: 'Aturan cicilan & format kwitansi',
      icon: CreditCard,
    },
    {
      id: 'laporan',
      label: 'Pengaturan Laporan',
      description: 'Kop, penandatangan & legalitas',
      icon: FileSpreadsheet,
    },
    {
      id: 'keamanan',
      label: 'Keamanan Sistem & Audit',
      description: 'Kebijakan password, session & log',
      icon: ShieldCheck,
      badge: 'Protected',
    },
  ];

  const query = (searchQuery || '').toLowerCase().trim();

  const filteredItems = menuItems.filter((item) => {
    if (!query) return true;
    const label = (item.label || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    return label.includes(query) || desc.includes(query);
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 flex flex-col space-y-3">
      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Cari pengaturan..."
          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
        />
        <svg
          className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Nav List */}
      <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 scrollbar-thin">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              id={`settings-menu-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group relative ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 shrink-0 transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold truncate leading-snug">
                    {index + 1}. {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        item.badge === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 group-hover:text-slate-500 truncate mt-0.5 font-normal">
                  {item.description}
                </p>
              </div>

              {isActive && (
                <div className="w-1.5 h-6 bg-emerald-600 rounded-full absolute right-1 top-1/2 -translate-y-1/2" />
              )}
            </button>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400">
            Pengaturan tidak ditemukan.
          </div>
        )}
      </div>

      {/* Quick Status Note */}
      <div className="pt-2 border-t border-slate-100 px-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SIMKEU v2.4.0
          </span>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            Audit Aktif
          </span>
        </div>
      </div>
    </div>
  );
};
