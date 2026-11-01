import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { WelcomeBanner } from './components/WelcomeBanner';
import { KpiCards } from './components/KpiCards';
import { MainFinancialChart } from './components/MainFinancialChart';
import { BankBalances } from './components/BankBalances';
import { IncomeExpenseAnalysis } from './components/IncomeExpenseAnalysis';
import { StudentArrearsTable } from './components/StudentArrearsTable';
import { RecentTransactionsTable } from './components/RecentTransactionsTable';
import { QuickActions } from './components/QuickActions';
import { QuickActionModals } from './components/QuickActionModals';
import { AllTransactionsModal } from './components/AllTransactionsModal';
import { Toast } from './components/Toast';
import { DataSantriView } from './components/santri/DataSantriView';
import { DetailKeuanganSantriView } from './components/santri/DetailKeuanganSantriView';
import { DataKelasRombelView } from './components/santri/DataKelasRombelView';
import { PaketMakanView } from './components/santri/PaketMakanView';
import { TagihanBulananView } from './components/tagihan/TagihanBulananView';
import { GenerateTagihanBulananView } from './components/generate/GenerateTagihanBulananView';
import { TagihanTahunanView } from './components/tagihan_tahunan/TagihanTahunanView';
import { ManajemenDiskonView } from './components/diskon/ManajemenDiskonView';
import { TunggakanSantriView } from './components/tunggakan/TunggakanSantriView';
import { ImportPembayaranView } from './components/import_pembayaran/ImportPembayaranView';
import { ManajemenPengeluaranView } from './components/pengeluaran/ManajemenPengeluaranView';
import { RekeningBankView } from './components/rekening/RekeningBankView';
import { PusatLaporanView } from './components/laporan/PusatLaporanView';
import { UserRoleView } from './components/user_role/UserRoleView';
import { PengaturanSistemView } from './components/pengaturan/PengaturanSistemView';
import { RingkasanKeuanganView } from './components/RingkasanKeuanganView';

// Auth & Security Components
import { LoginPage } from './components/auth/LoginPage';
import { LoginSuccessTransition } from './components/auth/LoginSuccessTransition';
import { FirstLoginPasswordModal } from './components/auth/FirstLoginPasswordModal';
import { AccountStatusScreen } from './components/auth/AccountStatusScreen';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { AdminResetPasswordModal } from './components/auth/AdminResetPasswordModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';
import { SessionExpiredScreen } from './components/auth/SessionExpiredScreen';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { UnsavedChangesModal } from './components/auth/UnsavedChangesModal';
import { AccessDeniedView } from './components/auth/AccessDeniedView';
import { SystemErrorView } from './components/auth/SystemErrorView';
import { NotFoundView } from './components/auth/NotFoundView';
import { MaintenanceModeView } from './components/auth/MaintenanceModeView';
import { UserActivityLogModal } from './components/auth/UserActivityLogModal';
import { NotificationDrawer } from './components/auth/NotificationDrawer';
import { AuthDemoToolbar } from './components/auth/AuthDemoToolbar';

import { initialStudents, emptyStudentPlaceholder } from './data/studentsData';
import {
  initialKpiSummary,
  bankAccountsData,
  initialTransactions,
  initialNotifications,
  classArrearsData,
} from './data/initialData';
import { initialAuthUsers, initialAuthAuditLogs } from './data/authData';
import {
  BankAccount,
  ClassArrears,
  KpiSummary,
  NotificationItem,
  Transaction,
  Student,
  CurrentAuthUser,
  AppUser,
} from './types';
import { ShieldCheck, Heart, Landmark, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<CurrentAuthUser | null>(initialAuthUsers[0]);
  const [authStatus, setAuthStatus] = useState<
    | 'authenticated'
    | 'unauthenticated'
    | 'account_status'
    | 'session_expired'
    | 'maintenance'
    | 'error_500'
    | 'not_found_404'
    | 'access_denied'
  >('authenticated');

  const [transitionUser, setTransitionUser] = useState<CurrentAuthUser | null>(null);
  const [statusBlockedUser, setStatusBlockedUser] = useState<CurrentAuthUser | null>(null);

  // Security & Auth Modals
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showAdminResetModal, setShowAdminResetModal] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<AppUser | null>(null);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSessionTimeoutModal, setShowSessionTimeoutModal] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [showAuditLogModal, setShowAuditLogModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Navigation & Content state
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isStudentDetailActive, setIsStudentDetailActive] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student>(initialStudents[0] || emptyStudentPlaceholder);
  const [academicYear, setAcademicYear] = useState('2026 / 2027');
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [kpiSummary, setKpiSummary] = useState<KpiSummary>(initialKpiSummary);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(bankAccountsData);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [quickModalType, setQuickModalType] = useState<
    'pemasukan' | 'pengeluaran' | 'tagihan' | 'import' | null
  >(null);
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Login handler from LoginPage
  const handleLoginSuccess = (user: CurrentAuthUser) => {
    if (user.status !== 'Aktif') {
      setStatusBlockedUser(user);
      setAuthStatus('account_status');
      return;
    }

    setTransitionUser(user);
  };

  const handleTransitionComplete = () => {
    if (!transitionUser) return;

    setCurrentUser(transitionUser);
    const userToLogin = transitionUser;
    setTransitionUser(null);
    setAuthStatus('authenticated');

    // If first login required, trigger modal
    if (userToLogin.isFirstLogin) {
      setShowFirstLoginModal(true);
    }

    // Role-based initial active nav
    if (userToLogin.role === 'Pimpinan') {
      setActiveNav('Dashboard');
    } else if (userToLogin.role === 'Bendahara') {
      setActiveNav('Dashboard');
    } else {
      setActiveNav('Dashboard');
    }

    setToastMessage(`Selamat datang kembali, ${userToLogin.name} (${userToLogin.role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogoutConfirmModal(false);
    setShowSessionTimeoutModal(false);
    setAuthStatus('unauthenticated');
    setToastMessage('Anda telah keluar dari sesi SIMKEU.');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMessage('Semua notifikasi ditandai telah dibaca.');
  };

  const handleAddTransaction = (newTrxData: Omit<Transaction, 'id'>) => {
    const newTrx: Transaction = {
      ...newTrxData,
      id: `trx-${Date.now().toString().slice(-4)}`,
    };

    setTransactions((prev) => [newTrx, ...prev]);

    // Update KPI dynamically
    if (newTrx.jenis === 'Pemasukan') {
      setKpiSummary((prev) => ({
        ...prev,
        totalPemasukan: prev.totalPemasukan + newTrx.nominal,
        totalSaldo: prev.totalSaldo + newTrx.nominal,
      }));
    } else {
      setKpiSummary((prev) => ({
        ...prev,
        totalPengeluaran: prev.totalPengeluaran + newTrx.nominal,
        totalSaldo: Math.max(0, prev.totalSaldo - newTrx.nominal),
      }));
    }
  };

  const handleKpiCardClick = (cardType: string) => {
    if (cardType === 'pemasukan' || cardType === 'pengeluaran') {
      setShowAllTransactionsModal(true);
    } else if (cardType === 'tunggakan') {
      const el = document.getElementById('student-arrears-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (cardType === 'saldo') {
      const el = document.getElementById('bank-balances-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTriggerDemoState = (stateName: string) => {
    switch (stateName) {
      case 'first_login':
        if (!currentUser) setCurrentUser(initialAuthUsers[4]);
        setShowFirstLoginModal(true);
        setAuthStatus('authenticated');
        break;
      case 'locked':
        setStatusBlockedUser(initialAuthUsers[3]);
        setAuthStatus('account_status');
        break;
      case 'inactive':
        setStatusBlockedUser(initialAuthUsers[1]); // Siti Rahmawati (Nonaktif)
        setAuthStatus('account_status');
        break;
      case 'suspended':
        setStatusBlockedUser(initialAuthUsers[2]); // Hendra Wijaya (Ditangguhkan)
        setAuthStatus('account_status');
        break;
      case 'timeout_warning':
        setShowSessionTimeoutModal(true);
        break;
      case 'session_expired':
        setAuthStatus('session_expired');
        break;
      case 'unsaved_changes':
        setShowUnsavedChangesModal(true);
        break;
      case 'access_denied':
        setAuthStatus('access_denied');
        break;
      case 'error_500':
        setAuthStatus('error_500');
        break;
      case 'not_found_404':
        setAuthStatus('not_found_404');
        break;
      case 'maintenance':
        setAuthStatus('maintenance');
        break;
      case 'profile_modal':
        setShowUserProfileModal(true);
        break;
      case 'change_password':
        setShowChangePasswordModal(true);
        break;
      case 'admin_reset_password':
        setSelectedUserForReset({
          id: 'u-2',
          username: 'bendahara1',
          name: 'Siti Rahmawati, S.E.',
          role: 'Bendahara',
          status: 'Aktif',
          lastLogin: 'Hari ini, 08:30 WIB',
          avatarInitials: 'SR',
          avatarColor: 'bg-emerald-600 text-white',
          phone: '0813-2345-6789',
          email: 'siti.rahmawati@pesantren.local',
        });
        setShowAdminResetModal(true);
        break;
      case 'audit_log':
        setShowAuditLogModal(true);
        break;
      default:
        break;
    }
  };

  // Full Screen / Isolated Auth States
  if (authStatus === 'unauthenticated') {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenForgotPassword={() => setShowForgotPasswordModal(true)}
        />

        {showForgotPasswordModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgotPasswordModal(false)}
            onSubmitRequest={(uname, notes) => {
              setToastMessage(`Permintaan reset password untuk @${uname} berhasil dikirim ke Admin.`);
            }}
          />
        )}

        {transitionUser && (
          <LoginSuccessTransition
            user={transitionUser}
            onTransitionComplete={handleTransitionComplete}
          />
        )}

        <AuthDemoToolbar
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            setAuthStatus('authenticated');
            setToastMessage(`Beralih ke persona: ${user.name} (${user.role})`);
          }}
          onTriggerState={handleTriggerDemoState}
          onLogout={handleLogout}
        />

        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  if (authStatus === 'account_status' && statusBlockedUser) {
    return (
      <>
        <AccountStatusScreen
          user={statusBlockedUser}
          onReturnToLogin={() => {
            setAuthStatus('unauthenticated');
            setStatusBlockedUser(null);
          }}
        />
        <AuthDemoToolbar
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            setAuthStatus('authenticated');
          }}
          onTriggerState={handleTriggerDemoState}
          onLogout={handleLogout}
        />
      </>
    );
  }

  if (authStatus === 'session_expired') {
    return (
      <>
        <SessionExpiredScreen
          onReturnToLogin={() => setAuthStatus('unauthenticated')}
        />
        <AuthDemoToolbar
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            setAuthStatus('authenticated');
          }}
          onTriggerState={handleTriggerDemoState}
          onLogout={handleLogout}
        />
      </>
    );
  }

  if (authStatus === 'maintenance') {
    return (
      <>
        <MaintenanceModeView
          onReturnToLogin={() => setAuthStatus('unauthenticated')}
        />
        <AuthDemoToolbar
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            setAuthStatus('authenticated');
          }}
          onTriggerState={handleTriggerDemoState}
          onLogout={handleLogout}
        />
      </>
    );
  }

  // Determine top header title & subtitle
  let pageTitle = 'Pengaturan Sistem & Tahun Ajaran';
  let pageSubtitle = 'Pusat konfigurasi parameter operasional, tarif pembiayaan, tahun ajaran, dan tata kelola keuangan pesantren.';
  let pageBadge = 'Pusat Konfigurasi';
  let breadcrumb: string | undefined = 'Pengaturan / Pengaturan Sistem';

  if (authStatus === 'access_denied') {
    pageTitle = 'Akses Terbatas';
    pageSubtitle = 'Otoritas tidak mencukupi untuk membuka modul sistem.';
    pageBadge = 'Hak Akses';
    breadcrumb = 'Sistem / Akses Ditolak';
  } else if (authStatus === 'error_500') {
    pageTitle = 'Galat Sistem (500)';
    pageSubtitle = 'Kendala pemrosesan server internal.';
    pageBadge = 'Error 500';
    breadcrumb = 'Sistem / Galat';
  } else if (authStatus === 'not_found_404') {
    pageTitle = 'Halaman Tidak Ditemukan (404)';
    pageSubtitle = 'Tautan modul tidak terdaftar.';
    pageBadge = 'Status 404';
    breadcrumb = 'Sistem / 404';
  } else if (activeNav === 'Pengaturan Sistem' || activeNav === 'Tahun Ajaran' || activeNav === 'Data Pesantren' || activeNav === 'Pengaturan') {
    pageTitle = 'Pengaturan Sistem & Tahun Ajaran';
    pageSubtitle = 'Pusat konfigurasi parameter operasional, tarif pembiayaan, tahun ajaran, dan tata kelola keuangan pesantren.';
    pageBadge = 'Pusat Konfigurasi';
    breadcrumb = 'Pengaturan / Pengaturan Sistem';
  } else if (activeNav === 'User & Role' || activeNav === 'Pengguna' || activeNav === 'Role & Hak Akses') {
    pageTitle = 'User, Role & Hak Akses';
    pageSubtitle = 'Manajemen pengguna, role-based access control (RBAC), rekam jejak audit aktivitas, dan keamanan login.';
    pageBadge = 'Keamanan Terpusat';
    breadcrumb = 'Pengaturan / User & Role';
  } else if (activeNav === 'Laporan Harian') {
    pageTitle = 'Laporan Keuangan Harian';
    pageSubtitle = 'Ringkasan mutasi kas hari ini, jurnal transaksi harian, dan posisi saldo riil per jam operasional.';
    pageBadge = '01 Sep 2026';
    breadcrumb = 'Laporan / Laporan Harian';
  } else if (activeNav === 'Laporan Bulanan') {
    pageTitle = 'Laporan Keuangan Bulanan';
    pageSubtitle = 'Rekapitulasi komprehensif penerimaan, pengeluaran pos anggaran, neraca, dan surplus bulanan.';
    pageBadge = 'Agustus 2026';
    breadcrumb = 'Laporan / Laporan Bulanan';
  } else if (activeNav === 'Laporan Pemasukan') {
    pageTitle = 'Laporan Penerimaan Keuangan';
    pageSubtitle = 'Rincian seluruh pos pendapatan kas dan transfer bank santri & pesantren.';
    pageBadge = 'Real-Time';
    breadcrumb = 'Laporan / Laporan Pemasukan';
  } else if (activeNav === 'Laporan Pengeluaran') {
    pageTitle = 'Laporan Beban & Pengeluaran';
    pageSubtitle = 'Rincian realisasi belanja operasional, gaji, sarpras, konsumsi dapur, dan audit nota.';
    pageBadge = 'Audit Nota';
    breadcrumb = 'Laporan / Laporan Pengeluaran';
  } else if (activeNav === 'Laporan Semester') {
    pageTitle = 'Laporan Keuangan Semester';
    pageSubtitle = 'Evaluasi neraca dan realisasi anggaran semester santri dan pesantren.';
    pageBadge = 'Ganjil 26/27';
    breadcrumb = 'Laporan / Laporan Semester';
  } else if (activeNav === 'Laporan Tahunan') {
    pageTitle = 'Laporan Keuangan Tahunan';
    pageSubtitle = 'Laporan pertanggungjawaban tahun ajaran dan tren konsolidasi kas.';
    pageBadge = 'TA 2026/2027';
    breadcrumb = 'Laporan / Laporan Tahunan';
  } else if (activeNav === 'Pusat Laporan' || activeNav === 'Laporan Keuangan') {
    pageTitle = 'Pusat Laporan Keuangan';
    pageSubtitle = 'Pusat pelaporan terstandarisasi, akurat, dan terverifikasi audit langsung dari basis data transaksi SIMKEU.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Laporan / Pusat Laporan Keuangan';
  } else if (activeNav === 'Rekening Bank' || activeNav === 'Daftar Rekening' || activeNav === 'Mutasi Rekening' || activeNav === 'Saldo Rekening') {
    pageTitle = 'Rekening Bank';
    pageSubtitle = 'Pusat monitoring saldo terpusat BNI, mutasi transaksi masuk/keluar, transfer internal, dan rekonsiliasi berkala.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Rekening / Rekening Bank';
  } else if (activeNav === 'Pengeluaran' || activeNav === 'Manajemen Pengeluaran') {
    pageTitle = 'Manajemen Pengeluaran';
    pageSubtitle = 'Pencatatan kas keluar, kelengkapan nota/kwitansi, audit pos anggaran, dan visualisasi pengeluaran santri & pesantren.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Keuangan / Manajemen Pengeluaran';
  } else if (activeNav === 'Import Pembayaran') {
    pageTitle = 'Import Pembayaran';
    pageSubtitle = 'Import data pembayaran dari aplikasi eksternal dan cocokkan otomatis dengan tagihan santri.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Pembayaran / Import Pembayaran';
  } else if (activeNav === 'Tunggakan' || activeNav === 'Laporan Tunggakan') {
    pageTitle = 'Tunggakan Santri';
    pageSubtitle = 'Monitoring sentral tagihan santri yang belum diselesaikan (Bulanan & Tahunan).';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Tagihan / Tunggakan Santri';
  } else if (activeNav === 'Diskon') {
    pageTitle = 'Manajemen Diskon Tagihan';
    pageSubtitle = 'Konfigurasi dan riwayat diskon potongan tagihan bulanan santri.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Tagihan / Diskon';
  } else if (activeNav === 'Tagihan Tahunan') {
    pageTitle = 'Tagihan Tahunan';
    pageSubtitle = 'Kelola tagihan tahunan dan pembayaran per semester santri.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Tagihan / Tagihan Tahunan';
  } else if (activeNav === 'Generate Tagihan') {
    pageTitle = 'Generate Tagihan Bulanan';
    pageSubtitle = 'Buat tagihan bulanan secara otomatis untuk seluruh santri aktif.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Tagihan / Generate Tagihan Bulanan';
  } else if (activeNav === 'Tagihan Bulanan') {
    pageTitle = 'Tagihan Bulanan';
    pageSubtitle = 'Kelola dan monitor tagihan bulanan seluruh santri.';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Tagihan / Tagihan Bulanan';
  } else if (activeNav === 'Data Santri') {
    if (isStudentDetailActive) {
      pageTitle = 'Detail Keuangan Santri';
      pageSubtitle = 'Informasi tagihan, pembayaran, dan tunggakan santri.';
      pageBadge = 'Tahun Ajaran 2026/2027';
      breadcrumb = 'Santri / Data Santri / Detail Keuangan';
    } else {
      pageTitle = 'Data Santri';
      pageSubtitle = 'Kelola data dan informasi santri PM. Raudhatussalam Mahato';
      pageBadge = 'Tahun Ajaran 2026/2027';
      breadcrumb = 'Santri / Data Santri';
    }
  } else if (activeNav === 'Ringkasan Keuangan') {
    pageTitle = 'Ringkasan & Analisis Keuangan';
    pageSubtitle = 'Evaluasi kinerja fiskal, rasio solvabilitas, dan perbandingan unit pesantren.';
    pageBadge = 'Analitik Fiskal';
    breadcrumb = 'Dashboard / Ringkasan Keuangan';
  } else if (activeNav === 'Dashboard') {
    pageTitle = currentUser?.role === 'Pimpinan' ? 'Dashboard Eksekutif' : 'Dashboard Keuangan';
    pageSubtitle = 'Ringkasan kondisi keuangan pesantren secara real-time';
    pageBadge = 'Live Real-Time';
    breadcrumb = undefined;
  } else if (activeNav === 'Kelas' || activeNav === 'Data Kelas' || activeNav === 'Rombel' || activeNav === 'Kelas & Rombel') {
    pageTitle = 'Data Kelas & Rombel';
    pageSubtitle = 'Manajemen pembagian rombel MTs (1–3) dan MA (4–6), wali kelas, dan ruang belajar';
    pageBadge = 'Tahun Ajaran 2026/2027';
    breadcrumb = 'Santri / Kelas & Rombel';
  } else if (activeNav === 'Paket Makan') {
    pageTitle = 'Paket Makan Dapur Santri';
    pageSubtitle = 'Tarif dan alokasi konsumsi Paket A, Paket B, dan Paket C dapur santri';
    pageBadge = 'Logistik Dapur';
    breadcrumb = 'Santri / Paket Makan';
  }

  const handleNavigateToStudentDetail = (nis: string) => {
    const found = initialStudents.find((s) => s.nis === nis) || {
      ...emptyStudentPlaceholder,
      nis,
      nama: 'Santri Terpilih',
    };
    setSelectedStudentForDetail(found);
    setIsStudentDetailActive(true);
    setActiveNav('Data Santri');
    setToastMessage(`Membuka profil keuangan santri: ${found.nama}`);
  };

  const handleNavigationAccessCheck = (item: string) => {
    // Role check: If Bendahara tries to access Admin Settings
    if (
      currentUser?.role === 'Bendahara' &&
      (item === 'User & Role' || item === 'Pengaturan Sistem' || item === 'Data Pesantren')
    ) {
      setAuthStatus('access_denied');
      return;
    }

    if (
      currentUser?.role === 'Pimpinan' &&
      (item === 'Generate Tagihan' || item === 'Import Pembayaran' || item === 'User & Role')
    ) {
      setAuthStatus('access_denied');
      return;
    }

    // Normal switch
    setAuthStatus('authenticated');
    setActiveNav(item);
    if (item === 'Tunggakan' && activeNav === 'Dashboard') {
      document.getElementById('student-arrears-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Saldo Rekening' && activeNav === 'Dashboard') {
      document.getElementById('bank-balances-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Data Pembayaran') {
      setShowAllTransactionsModal(true);
    } else if (item === 'Pemasukan') {
      setQuickModalType('pemasukan');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased">
      {/* 1. Sidebar */}
      <Sidebar
        activeNav={activeNav}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onOpenProfile={() => setShowUserProfileModal(true)}
        onSelectNav={handleNavigationAccessCheck}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 ml-0 flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <TopHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          badgeText={pageBadge}
          breadcrumb={breadcrumb}
          academicYear={academicYear}
          onChangeAcademicYear={(year) => {
            setAcademicYear(year);
            setToastMessage(`Tahun Ajaran aktif diubah ke ${year}`);
          }}
          notifications={notifications}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          currentUser={currentUser}
          onOpenProfile={() => setShowUserProfileModal(true)}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
          onOpenAuditLog={() => setShowAuditLogModal(true)}
          onOpenNotificationDrawer={() => setShowNotificationDrawer(true)}
          onLogoutRequest={() => setShowLogoutConfirmModal(true)}
          onOpenQuickAction={(action) => {
            if (action === 'import') {
              setActiveNav('Import Pembayaran');
            } else {
              setQuickModalType(action);
            }
          }}
        />

        {/* Main Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {authStatus === 'access_denied' ? (
            <AccessDeniedView
              currentRole={currentUser?.role || 'Pengguna'}
              attemptedPageName={activeNav}
              onReturnToDashboard={() => {
                setAuthStatus('authenticated');
                setActiveNav('Dashboard');
              }}
            />
          ) : authStatus === 'error_500' ? (
            <SystemErrorView
              onRetry={() => {
                setAuthStatus('authenticated');
                setToastMessage('Permintaan dimuat ulang.');
              }}
              onReturnToDashboard={() => {
                setAuthStatus('authenticated');
                setActiveNav('Dashboard');
              }}
            />
          ) : authStatus === 'not_found_404' ? (
            <NotFoundView
              onReturnToDashboard={() => {
                setAuthStatus('authenticated');
                setActiveNav('Dashboard');
              }}
            />
          ) : activeNav === 'Pengaturan Sistem' || activeNav === 'Tahun Ajaran' || activeNav === 'Data Pesantren' || activeNav === 'Pengaturan' ? (
            /* PENGATURAN SISTEM & TAHUN AJARAN VIEW */
            <PengaturanSistemView onNavigateToNav={(nav) => setActiveNav(nav)} />
          ) : activeNav === 'User & Role' || activeNav === 'Pengguna' || activeNav === 'Role & Hak Akses' ? (
            /* USER & ROLE VIEW */
            <UserRoleView onNavigateToNav={(nav) => setActiveNav(nav)} />
          ) : activeNav === 'Pusat Laporan' ||
            activeNav === 'Laporan Keuangan' ||
            activeNav === 'Laporan Bulanan' ||
            activeNav === 'Laporan Harian' ||
            activeNav === 'Laporan Semester' ||
            activeNav === 'Laporan Tahunan' ||
            activeNav === 'Buku Kas Umum' ||
            activeNav === 'Buku Kas' ||
            activeNav === 'Laporan Pemasukan' ||
            activeNav === 'Laporan Pengeluaran' ? (
            /* PUSAT LAPORAN VIEW */
            <PusatLaporanView
              onNavigateToNav={(nav) => setActiveNav(nav)}
              initialReportType={
                activeNav === 'Buku Kas Umum' || activeNav === 'Buku Kas'
                  ? 'buku_kas_umum'
                  : activeNav === 'Laporan Harian'
                  ? 'harian'
                  : activeNav === 'Laporan Bulanan'
                  ? 'bulanan'
                  : activeNav === 'Laporan Semester'
                  ? 'semester'
                  : activeNav === 'Laporan Tahunan'
                  ? 'tahunan'
                  : activeNav === 'Laporan Pemasukan'
                  ? 'pemasukan'
                  : activeNav === 'Laporan Pengeluaran'
                  ? 'pengeluaran'
                  : null
              }
              initialPeriodType={
                activeNav === 'Laporan Harian'
                  ? 'hari_ini'
                  : activeNav === 'Laporan Semester'
                  ? 'semester_ini'
                  : activeNav === 'Laporan Tahunan'
                  ? 'tahun_ini'
                  : 'bulan_ini'
              }
            />
          ) : activeNav === 'Rekening Bank' || activeNav === 'Daftar Rekening' || activeNav === 'Mutasi Rekening' || activeNav === 'Saldo Rekening' ? (
            /* REKENING BANK VIEW */
            <RekeningBankView />
          ) : activeNav === 'Pengeluaran' || activeNav === 'Manajemen Pengeluaran' ? (
            /* MANAJEMEN PENGELUARAN VIEW */
            <ManajemenPengeluaranView />
          ) : activeNav === 'Import Pembayaran' ? (
            /* IMPORT PEMBAYARAN VIEW */
            <ImportPembayaranView
              onNavigateToTunggakan={() => setActiveNav('Tunggakan')}
              onNavigateToBulanan={() => setActiveNav('Tagihan Bulanan')}
              onNavigateToTahunan={() => setActiveNav('Tagihan Tahunan')}
            />
          ) : activeNav === 'Tunggakan' || activeNav === 'Laporan Tunggakan' ? (
            /* TUNGGAKAN SANTRI VIEW */
            <TunggakanSantriView
              onNavigateToStudentDetail={handleNavigateToStudentDetail}
            />
          ) : activeNav === 'Diskon' ? (
            /* MANAJEMEN DISKON TAGIHAN VIEW */
            <ManajemenDiskonView
              onNavigateToGenerate={() => setActiveNav('Generate Tagihan')}
            />
          ) : activeNav === 'Tagihan Tahunan' ? (
            /* TAGIHAN TAHUNAN VIEW */
            <TagihanTahunanView
              onNavigateToStudentDetail={handleNavigateToStudentDetail}
              onShowToast={(msg, type) => setToastMessage(msg)}
            />
          ) : activeNav === 'Generate Tagihan' ? (
            /* GENERATE TAGIHAN BULANAN VIEW */
            <GenerateTagihanBulananView
              onBackToTagihanList={() => setActiveNav('Tagihan Bulanan')}
              onNavigateToDashboard={() => setActiveNav('Dashboard')}
              onShowToast={(msg) => setToastMessage(msg)}
            />
          ) : activeNav === 'Tagihan Bulanan' ? (
            /* TAGIHAN BULANAN VIEW */
            <TagihanBulananView
              onViewStudentDetail={handleNavigateToStudentDetail}
              onNavigateToGenerate={() => setActiveNav('Generate Tagihan')}
              onShowToast={(msg) => setToastMessage(msg)}
            />
          ) : activeNav === 'Ringkasan Keuangan' ? (
            /* RINGKASAN & ANALISIS KEUANGAN VIEW */
            <RingkasanKeuanganView onNavigateToNav={(nav) => setActiveNav(nav)} />
          ) : activeNav === 'Kelas' || activeNav === 'Data Kelas' || activeNav === 'Rombel' || activeNav === 'Kelas & Rombel' ? (
            /* DATA KELAS & ROMBEL VIEW */
            <DataKelasRombelView
              onNavigateToStudentDetail={handleNavigateToStudentDetail}
              onShowToast={(msg) => setToastMessage(msg)}
            />
          ) : activeNav === 'Paket Makan' ? (
            /* PAKET MAKAN VIEW */
            <PaketMakanView
              onNavigateToStudentDetail={handleNavigateToStudentDetail}
              onShowToast={(msg) => setToastMessage(msg)}
            />
          ) : activeNav === 'Data Santri' ? (
            isStudentDetailActive ? (
              /* DETAIL KEUANGAN SANTRI VIEW */
              <DetailKeuanganSantriView
                student={selectedStudentForDetail}
                onBackToDataSantri={() => setIsStudentDetailActive(false)}
                onSuccessToast={(msg) => setToastMessage(msg)}
              />
            ) : (
              /* DATA SANTRI LIST VIEW */
              <DataSantriView
                onSuccessToast={(msg) => setToastMessage(msg)}
                onViewStudentDetail={(std) => {
                  setSelectedStudentForDetail(std);
                  setIsStudentDetailActive(true);
                }}
              />
            )
          ) : (
            /* DASHBOARD / FINANCIAL VIEW */
            <>
              {/* Welcome Banner */}
              <WelcomeBanner currentUser={currentUser} />

              {/* Quick Actions Bar */}
              <QuickActions onOpenModal={(action) => setQuickModalType(action)} />

              {/* Financial KPI Cards (4 Cards) */}
              <KpiCards summary={kpiSummary} onCardClick={handleKpiCardClick} />

              {/* Main Financial Chart & Monthly Summary */}
              <MainFinancialChart />

              {/* Bank Account Balances */}
              <BankBalances accounts={bankAccounts} />

              {/* Income & Expense Analysis (Donut + Ranked list) */}
              <IncomeExpenseAnalysis />

              {/* Student Arrears Table */}
              <StudentArrearsTable
                onViewAll={() => {
                  setActiveNav('Tagihan Bulanan');
                  setToastMessage('Beralih ke halaman Tagihan Bulanan.');
                }}
              />

              {/* Recent Transactions Table */}
              <RecentTransactionsTable
                transactions={transactions}
                onViewAll={() => setShowAllTransactionsModal(true)}
              />
            </>
          )}

          {/* Institutional Footer */}
          <footer className="pt-6 pb-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">
                SIMKEU PM. RAUDHATUSSALAM MAHATO
              </span>
              <span>•</span>
              <span>Sistem Manajemen Keuangan Terintegrasi</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Database Enkripsi BNI Host-to-Host
              </span>
              <span>© {new Date().getFullYear()} Yayasan Pondok Modern Raudhatussalam Mahato</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Quick Action Modals */}
      <QuickActionModals
        modalType={quickModalType}
        onClose={() => setQuickModalType(null)}
        onAddTransaction={handleAddTransaction}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      {/* Full Ledger Modal */}
      <AllTransactionsModal
        isOpen={showAllTransactionsModal}
        onClose={() => setShowAllTransactionsModal(false)}
        transactions={transactions}
      />

      {/* 1. First Login Force Password Modal */}
      {showFirstLoginModal && currentUser && (
        <FirstLoginPasswordModal
          user={currentUser}
          onPasswordUpdated={(updated) => {
            setCurrentUser(updated);
            setShowFirstLoginModal(false);
            setToastMessage('Password akun Anda berhasil diperbarui. Selamat bertugas!');
          }}
          onCancelToLogin={() => {
            setShowFirstLoginModal(false);
            handleLogout();
          }}
        />
      )}

      {/* 2. User Profile Modal */}
      {showUserProfileModal && currentUser && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setShowUserProfileModal(false)}
          onSaveProfile={(updated) => {
            setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
            setToastMessage('Profil pengguna berhasil diperbarui.');
          }}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
        />
      )}

      {/* 3. Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onSuccessToast={(msg) => setToastMessage(msg)}
        />
      )}

      {/* 4. Admin Reset Password Modal */}
      {showAdminResetModal && (
        <AdminResetPasswordModal
          user={selectedUserForReset}
          onClose={() => setShowAdminResetModal(false)}
          onPasswordResetSuccess={(userId, newPass, forceChange) => {
            setToastMessage(`Password sementara berhasil dibuat: ${newPass}`);
          }}
        />
      )}

      {/* 5. Session Timeout Warning Modal */}
      {showSessionTimeoutModal && (
        <SessionTimeoutModal
          onStayLoggedIn={() => {
            setShowSessionTimeoutModal(false);
            setToastMessage('Sesi berhasil diperpanjang.');
          }}
          onLogoutNow={handleLogout}
        />
      )}

      {/* 6. Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutConfirmModal(false)}
          onConfirmLogout={handleLogout}
        />
      )}

      {/* 7. Unsaved Changes Protection Modal */}
      {showUnsavedChangesModal && (
        <UnsavedChangesModal
          onStayOnPage={() => setShowUnsavedChangesModal(false)}
          onSaveAndContinue={() => {
            setShowUnsavedChangesModal(false);
            setToastMessage('Data perubahan berhasil disimpan.');
          }}
          onDiscardAndLeave={() => {
            setShowUnsavedChangesModal(false);
            setToastMessage('Perubahan dibatalkan.');
          }}
        />
      )}

      {/* 8. Audit Log Keamanan Modal */}
      {showAuditLogModal && (
        <UserActivityLogModal
          onClose={() => setShowAuditLogModal(false)}
          logs={initialAuthAuditLogs}
        />
      )}

      {/* 9. Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={(notif) => {
          setShowNotificationDrawer(false);
          if (notif.title.includes('Tunggakan')) {
            setActiveNav('Tunggakan');
          } else if (notif.title.includes('Import')) {
            setActiveNav('Import Pembayaran');
          } else if (notif.title.includes('Tagihan')) {
            setActiveNav('Tagihan Bulanan');
          }
        }}
      />

      {/* 10. Interactive Auth Demo Toolbar */}
      <AuthDemoToolbar
        currentUser={currentUser}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          setAuthStatus('authenticated');
          setToastMessage(`Beralih ke persona: ${user.name} (${user.role})`);
        }}
        onTriggerState={handleTriggerDemoState}
        onLogout={handleLogout}
      />

      {/* Toast Feedback */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

