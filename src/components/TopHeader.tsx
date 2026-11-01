import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Info,
  ChevronDown,
  User,
  Shield,
  LogOut,
  SlidersHorizontal,
  Search,
  Menu,
  Lock,
  History,
} from 'lucide-react';
import { NotificationItem, CurrentAuthUser } from '../types';

interface TopHeaderProps {
  academicYear: string;
  onChangeAcademicYear: (year: string) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenQuickAction: (actionType: 'pemasukan' | 'pengeluaran' | 'tagihan' | 'import') => void;
  onToggleMobileSidebar?: () => void;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  breadcrumb?: string;
  currentUser?: CurrentAuthUser | null;
  onOpenProfile?: () => void;
  onOpenChangePassword?: () => void;
  onOpenAuditLog?: () => void;
  onOpenNotificationDrawer?: () => void;
  onLogoutRequest?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  academicYear,
  onChangeAcademicYear,
  notifications,
  onMarkAllNotificationsRead,
  searchQuery,
  onSearchChange,
  onToggleMobileSidebar,
  title = 'Dashboard Keuangan',
  subtitle = 'Ringkasan kondisi keuangan pesantren secara real-time',
  badgeText,
  breadcrumb,
  currentUser,
  onOpenProfile,
  onOpenChangePassword,
  onOpenAuditLog,
  onOpenNotificationDrawer,
  onLogoutRequest,
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const yearRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const academicYears = ['2026 / 2027', '2025 / 2026', '2024 / 2025'];

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 md:px-8 h-16 flex items-center transition-all shadow-2xs"
    >
      <div className="flex items-center justify-between gap-4 md:gap-6 max-w-[1440px] w-full mx-auto">
        {/* Left Side: Mobile Toggle + Page Title & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            {breadcrumb && (
              <div className="text-[10px] md:text-[11px] font-medium text-[#64748B] mb-0.5 flex items-center gap-1.5 truncate">
                {breadcrumb.split(' / ').map((crumb, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span className={idx === arr.length - 1 ? 'font-semibold text-[#064E3B]' : 'hover:text-[#334155]'}>
                      {crumb}
                    </span>
                    {idx < arr.length - 1 && <span className="text-[#94A3B8]">/</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 md:gap-3">
              <h2 className="text-base md:text-lg font-bold text-[#1E293B] tracking-tight truncate">
                {title}
              </h2>
              {badgeText && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-[10px] md:text-[11px] text-[#64748B] truncate hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Center / Search bar for quick ledger lookup */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi, santri, atau rekening..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 outline-none transition-all placeholder:text-[#94A3B8] text-[#334155]"
          />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-5">
          {/* 1. Academic Year Selector */}
          <div ref={yearRef} className="relative">
            <button
              id="btn-academic-year"
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="text-right flex items-center gap-1.5 focus:outline-none cursor-pointer group"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] leading-none text-right">
                  Tahun Ajaran
                </p>
                <p className="text-xs font-semibold text-[#064E3B] flex items-center justify-end gap-1 mt-0.5">
                  {academicYear} <ChevronDown className="w-3 h-3 text-[#064E3B]" />
                </p>
              </div>
            </button>

            {showYearDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#94A3B8]">
                  Pilih Tahun Ajaran
                </div>
                {academicYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      onChangeAcademicYear(year);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F8FAFC] transition ${
                      academicYear === year
                        ? 'text-[#064E3B] font-semibold bg-emerald-50/50'
                        : 'text-[#64748B]'
                    }`}
                  >
                    <span>{year}</span>
                    {academicYear === year && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Notification Bell Icon */}
          <div ref={notifRef} className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F8FAFC] transition"
              title="Notifikasi Sistem"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">
                      Notifikasi
                    </h4>
                    <p className="text-[10px] text-[#94A3B8]">
                      {unreadNotifsCount} notifikasi belum dibaca
                    </p>
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-[#064E3B] hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-[#F8FAFC] transition cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'payment' && (
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'warning' && (
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'info' && (
                          <div className="w-7 h-7 rounded-lg bg-slate-50 text-[#64748B] flex items-center justify-center border border-[#E2E8F0]">
                            <Info className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#1E293B] truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-[#94A3B8]">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-[#E2E8F0] text-center flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8] font-medium">
                    Semua log tersinkron
                  </span>
                  {onOpenNotificationDrawer && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifDropdown(false);
                        onOpenNotificationDrawer();
                      }}
                      className="text-[11px] text-[#064E3B] font-bold hover:underline"
                    >
                      Buka Semua Notifikasi →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. User Profile Section */}
          <div ref={profileRef} className="relative">
            <button
              id="btn-user-profile"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition shadow-2xs group cursor-pointer"
            >
              {/* Circular Avatar */}
              <div className={`w-7 h-7 rounded-full ${currentUser?.avatarColor || 'bg-[#064E3B] text-white'} flex items-center justify-center font-bold text-[11px] shadow-2xs`}>
                {currentUser?.avatarInitials || 'AD'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#1E293B] leading-tight">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[9px] font-medium text-[#94A3B8] leading-tight">
                  {currentUser?.role || 'Admin Sistem'}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] group-hover:text-[#64748B]" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2.5 border-b border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#1E293B] truncate">
                    {currentUser?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate">
                    {currentUser?.email || 'admin@raudhatussalam-mahato.sch.id'}
                  </p>
                  <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] font-bold text-emerald-800">
                    Role: {currentUser?.role || 'Administrator'}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onOpenProfile?.();
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    Profil Saya
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onOpenChangePassword?.();
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition font-medium"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    Ubah Password
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onOpenAuditLog?.();
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition font-medium"
                  >
                    <History className="w-3.5 h-3.5 text-purple-700" />
                    Audit Log Keamanan
                  </button>
                </div>

                <div className="border-t border-[#E2E8F0] pt-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onLogoutRequest?.();
                    }}
                    className="w-full px-3.5 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-bold transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    Keluar Sesi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
