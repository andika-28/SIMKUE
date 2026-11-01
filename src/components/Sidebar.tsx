import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Users,
  GraduationCap,
  Utensils,
  Receipt,
  CalendarDays,
  FileSpreadsheet,
  Percent,
  AlertCircle,
  CreditCard,
  Upload,
  Landmark,
  ArrowLeftRight,
  FileText,
  Calendar,
  CalendarRange,
  ShieldCheck,
  Building2,
  ChevronRight,
  Sparkles,
  Settings,
  BookOpen,
} from 'lucide-react';
import { CurrentAuthUser } from '../types';
import { useInstitutionIdentity } from '../utils/institutionStorage';

interface SidebarProps {
  activeNav: string;
  onSelectNav: (item: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentUser?: CurrentAuthUser | null;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile = false,
  onCloseMobile,
  currentUser,
  onOpenProfile,
}) => {
  const { identity } = useInstitutionIdentity();
  const userRole = currentUser?.role || 'Administrator';

  const navSections = [
    {
      group: 'DASHBOARD',
      items: [
        { id: 'Dashboard', label: userRole === 'Pimpinan' ? 'Dashboard Eksekutif' : 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'KEUANGAN',
      items: [
        { id: 'Ringkasan Keuangan', label: 'Ringkasan Keuangan', icon: PieChart },
        { id: 'Pemasukan', label: 'Pemasukan', icon: ArrowDownLeft },
        { id: 'Pengeluaran', label: 'Pengeluaran', icon: ArrowUpRight },
        { id: 'Saldo Rekening', label: 'Saldo Rekening', icon: Wallet },
      ],
    },
    ...(userRole !== 'Pimpinan'
      ? [
          {
            group: 'SANTRI',
            items: [
              { id: 'Data Santri', label: 'Data Santri', icon: Users },
              { id: 'Kelas', label: 'Kelas & Rombel', icon: GraduationCap },
              { id: 'Paket Makan', label: 'Paket Makan', icon: Utensils },
            ],
          },
        ]
      : []),
    {
      group: 'TAGIHAN',
      items: userRole === 'Pimpinan'
        ? [{ id: 'Tunggakan', label: 'Tunggakan Santri', icon: AlertCircle, badge: '72' }]
        : [
            { id: 'Tagihan Bulanan', label: 'Tagihan Bulanan', icon: Receipt },
            { id: 'Tagihan Tahunan', label: 'Tagihan Tahunan', icon: CalendarDays },
            { id: 'Generate Tagihan', label: 'Generate Tagihan', icon: FileSpreadsheet },
            { id: 'Diskon', label: 'Diskon', icon: Percent },
            { id: 'Tunggakan', label: 'Tunggakan', icon: AlertCircle, badge: '72' },
          ],
    },
    ...(userRole !== 'Pimpinan'
      ? [
          {
            group: 'PEMBAYARAN',
            items: [
              { id: 'Data Pembayaran', label: 'Data Pembayaran', icon: CreditCard },
              { id: 'Import Pembayaran', label: 'Import Pembayaran', icon: Upload },
            ],
          },
        ]
      : []),
    {
      group: 'REKENING',
      items: userRole === 'Pimpinan'
        ? [{ id: 'Daftar Rekening', label: 'Daftar Rekening', icon: Landmark }]
        : [
            { id: 'Daftar Rekening', label: 'Daftar Rekening', icon: Landmark },
            { id: 'Mutasi Rekening', label: 'Mutasi Rekening', icon: ArrowLeftRight },
          ],
    },
    {
      group: 'LAPORAN',
      items: [
        { id: 'Pusat Laporan', label: 'Pusat Laporan', icon: Sparkles, badge: 'Hub' },
        { id: 'Buku Kas Umum', label: 'Buku Kas Umum (BKU)', icon: BookOpen, badge: 'Cetak' },
        { id: 'Laporan Pemasukan', label: 'Laporan Pemasukan', icon: FileText },
        { id: 'Laporan Pengeluaran', label: 'Laporan Pengeluaran', icon: FileText },
        { id: 'Laporan Harian', label: 'Laporan Harian', icon: Calendar },
        { id: 'Laporan Bulanan', label: 'Laporan Bulanan', icon: CalendarDays },
        { id: 'Laporan Semester', label: 'Laporan Semester', icon: CalendarRange },
        { id: 'Laporan Tahunan', label: 'Laporan Tahunan', icon: CalendarRange },
        { id: 'Laporan Tunggakan', label: 'Laporan Tunggakan', icon: AlertCircle },
      ],
    },
    ...(userRole === 'Administrator'
      ? [
          {
            group: 'PENGATURAN',
            items: [
              { id: 'Pengaturan Sistem', label: 'Pengaturan Sistem', icon: Settings, badge: 'Pusat' },
              { id: 'User & Role', label: 'User & Role', icon: ShieldCheck },
              { id: 'Tahun Ajaran', label: 'Tahun Ajaran', icon: CalendarDays },
              { id: 'Data Pesantren', label: 'Data Pesantren', icon: Building2 },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="main-sidebar"
        className={`w-64 min-w-[16rem] max-w-[16rem] h-screen fixed left-0 top-0 bg-white text-[#334155] flex flex-col z-50 lg:z-30 border-r border-[#E2E8F0] shadow-xl lg:shadow-xs overflow-hidden transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#064E3B] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xs overflow-hidden border border-emerald-800/40">
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={identity.shortName || 'Logo'}
                  className="h-full w-full object-contain p-0.5 bg-white"
                />
              ) : (
                <span className="font-extrabold">R</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-[11px] font-bold leading-tight tracking-tight text-[#064E3B] uppercase">
                PM. Raudhatussalam
                <br />
                <span className="text-slate-700">Mahato</span>
              </h1>
              <p className="text-[9px] font-medium text-[#64748B] mt-0.5">
                Sistem Informasi Keuangan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {navSections.map((section, idx) => (
            <div key={section.group} className={idx > 0 ? 'mt-4' : ''}>
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    activeNav === item.id ||
                    (activeNav === 'Rekening Bank' && item.id === 'Daftar Rekening');
                  const IconComponent = item.icon;

                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        onSelectNav(item.id);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-150 text-left group ${
                        isActive
                          ? 'bg-[#064E3B] text-white font-semibold shadow-xs'
                          : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] font-medium'
                      }`}
                    >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-[#94A3B8] group-hover:text-[#064E3B]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-900 text-emerald-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer / User Status Card */}
      <div className="border-t border-[#E2E8F0] p-4 bg-white">
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-full flex items-center gap-3 rounded-xl bg-[#F8FAFC] hover:bg-emerald-50/60 p-3 border border-[#E2E8F0] hover:border-emerald-200 transition text-left cursor-pointer group"
          title="Klik untuk membuka Profil Pengguna"
        >
          <div className={`h-8 w-8 rounded-full ${currentUser?.avatarColor || 'bg-[#064E3B] text-white'} flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs`}>
            {currentUser?.avatarInitials || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold leading-none text-[#1E293B] group-hover:text-[#064E3B] truncate">
              {currentUser?.name || 'Administrator'}
            </p>
            <p className="text-[9px] text-[#64748B] mt-0.5 truncate">
              {currentUser?.role || 'Admin Sistem'} • Online
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition shrink-0" />
        </button>
      </div>
    </aside>
  </>
  );
};
