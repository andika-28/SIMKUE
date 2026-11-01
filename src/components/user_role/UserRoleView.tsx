import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Wallet,
  Eye,
  History,
  Lock,
  Plus,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import {
  AppUser,
  UserRoleType,
  UserActivityLog,
  LoginHistoryRecord,
  ActiveUserSession,
} from '../../types';
import {
  initialUsers,
  initialPermissionMatrix,
  initialActivityLogs,
  initialLoginHistory,
  initialActiveSessions,
} from '../../data/userData';
import { UserListTab } from './UserListTab';
import { RoleMatrixTab } from './RoleMatrixTab';
import { UserActivityTab } from './UserActivityTab';
import { LoginSecurityTab } from './LoginSecurityTab';
import { AddUserModal } from './AddUserModal';
import { UserDetailDrawer } from './UserDetailDrawer';
import { PermissionEditorModal } from './PermissionEditorModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { DeactivateUserModal } from './DeactivateUserModal';
import { ActivityDetailDrawer } from './ActivityDetailDrawer';

interface UserRoleViewProps {
  onNavigateToNav?: (nav: string) => void;
}

export const UserRoleView: React.FC<UserRoleViewProps> = ({ onNavigateToNav }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'activity' | 'security'>('users');

  // State collections
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [permissions, setPermissions] = useState(initialPermissionMatrix);
  const [activities, setActivities] = useState<UserActivityLog[]>(initialActivityLogs);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>(initialLoginHistory);
  const [activeSessions, setActiveSessions] = useState<ActiveUserSession[]>(initialActiveSessions);

  // Modals & Drawers state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<AppUser | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<UserRoleType | null>(null);
  const [isPermissionEditorOpen, setIsPermissionEditorOpen] = useState(false);

  const [selectedUserForReset, setSelectedUserForReset] = useState<AppUser | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState<AppUser | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const [selectedActivityForDetail, setSelectedActivityForDetail] = useState<UserActivityLog | null>(null);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // User counts
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'Administrator').length;
  const bendaharaCount = users.filter((u) => u.role === 'Bendahara').length;
  const pimpinanCount = users.filter((u) => u.role === 'Pimpinan').length;

  // Handlers
  const handleAddUser = (newUserData: Partial<AppUser>) => {
    const newUser: AppUser = {
      id: `USR-00${users.length + 1}`,
      name: newUserData.name || 'Pengguna Baru',
      username: newUserData.username || 'user',
      role: newUserData.role || 'Bendahara',
      title: newUserData.title || 'Staf Keuangan',
      status: newUserData.status || 'Aktif',
      phone: newUserData.phone,
      email: newUserData.email,
      avatarColor: newUserData.avatarColor || 'bg-blue-600 text-white',
      avatarInitials: newUserData.avatarInitials || 'PB',
      createdAt: '02 Sep 2026',
      lastLogin: 'Belum pernah login',
      lastActivity: 'Akun baru dibuat',
      lastActivityModule: 'User & Role',
      passwordChangedAt: '02 Sep 2026',
      failedLoginCount: 0,
      totalActionsCount: 0,
    };

    setUsers([newUser, ...users]);

    // Record audit activity
    const newLog: UserActivityLog = {
      id: `ACT-20260902-00${activities.length + 1}`,
      timestamp: '02 Sep 2026, 15:00 WIB',
      userId: 'USR-001',
      userName: 'Ahmad Fauzi',
      userRole: 'Administrator',
      activityName: `Menambahkan Pengguna Baru (@${newUser.username})`,
      activityType: 'CREATE',
      module: 'User & Role',
      relatedDataRef: newUser.id,
      relatedDataId: newUser.id,
      device: 'Windows Desktop (Admin)',
      browser: 'Google Chrome v128',
      ipAddress: '180.252.164.88',
      location: 'Mahato, Rokan Hulu',
      status: 'BERHASIL',
      notes: `Akun baru dibuat dengan role ${newUser.role} (${newUser.title}).`,
    };
    setActivities([newLog, ...activities]);

    showToast(`Pengguna baru ${newUser.name} (@${newUser.username}) berhasil disimpan.`);
  };

  const handleOpenDetail = (user: AppUser) => {
    setSelectedUserForDetail(user);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenReset = (user: AppUser) => {
    setSelectedUserForReset(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleConfirmReset = (userId: string, newPass: string, forceChange: boolean) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              passwordChangedAt: '02 Sep 2026',
              failedLoginCount: 0,
            }
          : u
      )
    );

    // Record audit activity
    const targetUser = users.find((u) => u.id === userId);
    const newLog: UserActivityLog = {
      id: `ACT-20260902-00${activities.length + 1}`,
      timestamp: '02 Sep 2026, 15:05 WIB',
      userId: 'USR-001',
      userName: 'Ahmad Fauzi',
      userRole: 'Administrator',
      activityName: `Reset Password Pengguna (@${targetUser?.username})`,
      activityType: 'EDIT',
      module: 'User & Role',
      relatedDataRef: targetUser?.id,
      device: 'Windows Desktop (Admin)',
      browser: 'Google Chrome v128',
      ipAddress: '180.252.164.88',
      location: 'Mahato, Rokan Hulu',
      status: 'BERHASIL',
      notes: `Password berhasil diatur ulang.${forceChange ? ' Pengguna wajib ganti password pada login berikutnya.' : ''}`,
    };
    setActivities([newLog, ...activities]);

    showToast(`Password untuk @${targetUser?.username} berhasil di-reset.`);
  };

  const handleOpenDeactivate = (user: AppUser) => {
    setSelectedUserForDeactivate(user);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = (userId: string, reason: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const newStatus = targetUser.status === 'Aktif' ? 'Nonaktif' : 'Aktif';

    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: newStatus,
              deactivationReason: reason,
            }
          : u
      )
    );

    // Audit log
    const newLog: UserActivityLog = {
      id: `ACT-20260902-00${activities.length + 1}`,
      timestamp: '02 Sep 2026, 15:10 WIB',
      userId: 'USR-001',
      userName: 'Ahmad Fauzi',
      userRole: 'Administrator',
      activityName: `${newStatus === 'Nonaktif' ? 'Menonaktifkan' : 'Mengaktifkan Kembali'} Pengguna (@${targetUser.username})`,
      activityType: 'EDIT',
      module: 'User & Role',
      relatedDataRef: targetUser.id,
      device: 'Windows Desktop (Admin)',
      browser: 'Google Chrome v128',
      ipAddress: '180.252.164.88',
      location: 'Mahato, Rokan Hulu',
      status: 'BERHASIL',
      notes: reason || 'Perubahan status operasional akun pengguna.',
      dataChanges: [
        { field: 'Status Akun', before: targetUser.status, after: newStatus, reason: reason || 'Pengaturan status' },
      ],
    };
    setActivities([newLog, ...activities]);

    showToast(`Status akun @${targetUser.username} berhasil diubah menjadi ${newStatus}. Data historis tetap terjaga.`);
  };

  const handleOpenPermissionEditor = (role: UserRoleType) => {
    setSelectedRoleForEdit(role);
    setIsPermissionEditorOpen(true);
  };

  const handleSavePermissions = (role: UserRoleType, updatedPermissions: string[]) => {
    // Record audit
    const newLog: UserActivityLog = {
      id: `ACT-20260902-00${activities.length + 1}`,
      timestamp: '02 Sep 2026, 15:15 WIB',
      userId: 'USR-001',
      userName: 'Ahmad Fauzi',
      userRole: 'Administrator',
      activityName: `Penyesuaian Matriks Hak Akses (${role})`,
      activityType: 'EDIT',
      module: 'User & Role',
      relatedDataRef: `ROLE-${role.toUpperCase()}`,
      device: 'Windows Desktop (Admin)',
      browser: 'Google Chrome v128',
      ipAddress: '180.252.164.88',
      location: 'Mahato, Rokan Hulu',
      status: 'BERHASIL',
      notes: `Konfigurasi hak akses role ${role} diperbarui dengan ${updatedPermissions.length} perizinan aktif.`,
    };
    setActivities([newLog, ...activities]);

    showToast(`Hak akses untuk role ${role} berhasil diperbarui.`);
  };

  const handleTerminateSession = (sessionId: string) => {
    setActiveSessions(activeSessions.filter((s) => s.id !== sessionId));
    showToast('Sesi perangkat berhasil diputuskan dari sistem.');
  };

  const handleSelectActivity = (activity: UserActivityLog) => {
    setSelectedActivityForDetail(activity);
    setIsActivityDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3 rounded-xl shadow-xl border border-emerald-600/30 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 USER SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Total Pengguna */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Users className="h-6 w-6 text-slate-700" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              Total
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-800">{totalUsers}</div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">Total Pengguna</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Pengguna aktif sistem</p>
          </div>
        </div>

        {/* CARD 2: Administrator */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <ShieldCheck className="h-6 w-6 text-emerald-800" />
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Admin
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-900">{adminCount}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Administrator</div>
            <p className="text-[11px] text-emerald-700 mt-0.5">Akses penuh sistem</p>
          </div>
        </div>

        {/* CARD 3: Bendahara */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Wallet className="h-6 w-6 text-blue-800" />
            </div>
            <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Keuangan
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-blue-900">{bendaharaCount}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Bendahara</div>
            <p className="text-[11px] text-blue-700 mt-0.5">Pengelola transaksi keuangan</p>
          </div>
        </div>

        {/* CARD 4: Pimpinan */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-white p-5 rounded-2xl border border-purple-200 shadow-2xs hover:shadow-sm hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Eye className="h-6 w-6 text-purple-800" />
            </div>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Eksekutif
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-purple-900">{pimpinanCount}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Pimpinan</div>
            <p className="text-[11px] text-purple-700 mt-0.5">Monitoring dan pengawasan</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl flex items-center gap-2 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Users className="h-4 w-4" />
          Pengguna
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-semibold">
            {totalUsers}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'roles'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Role & Hak Akses
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-800 font-semibold">
            RBAC
          </span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'activity'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <History className="h-4 w-4" />
          Aktivitas User
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-blue-800 font-semibold">
            {activities.length} Log
          </span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Lock className="h-4 w-4" />
          Login & Keamanan
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'users' && (
        <UserListTab
          users={users}
          onAddUser={() => setIsAddUserModalOpen(true)}
          onViewDetail={handleOpenDetail}
          onEditUser={(u) => handleOpenDetail(u)}
          onResetPassword={handleOpenReset}
          onDeactivateUser={handleOpenDeactivate}
        />
      )}

      {activeTab === 'roles' && (
        <RoleMatrixTab
          permissions={permissions}
          onOpenPermissionEditor={handleOpenPermissionEditor}
        />
      )}

      {activeTab === 'activity' && (
        <UserActivityTab
          activities={activities}
          onSelectActivity={handleSelectActivity}
        />
      )}

      {activeTab === 'security' && (
        <LoginSecurityTab
          loginHistory={loginHistory}
          activeSessions={activeSessions}
          onTerminateSession={handleTerminateSession}
          onLockUserAccount={(username) => {
            showToast(`Akun @${username} berhasil dikunci sementara.`);
          }}
          onResetPasswordPrompt={(username) => {
            const u = users.find((usr) => usr.username === username) || users[0];
            handleOpenReset(u);
          }}
        />
      )}

      {/* MODALS & DRAWERS */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSave={handleAddUser}
      />

      <UserDetailDrawer
        user={selectedUserForDetail}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onEdit={(u) => {
          showToast(`Pengaturan akun untuk ${u.name} siap diperbarui.`);
        }}
        onResetPassword={(u) => {
          setIsDetailDrawerOpen(false);
          handleOpenReset(u);
        }}
        onDeactivate={(u) => {
          setIsDetailDrawerOpen(false);
          handleOpenDeactivate(u);
        }}
        onViewActivity={(username) => {
          setIsDetailDrawerOpen(false);
          setActiveTab('activity');
        }}
      />

      {selectedRoleForEdit && (
        <PermissionEditorModal
          role={selectedRoleForEdit}
          isOpen={isPermissionEditorOpen}
          onClose={() => setIsPermissionEditorOpen(false)}
          onSavePermissions={handleSavePermissions}
        />
      )}

      <ResetPasswordModal
        user={selectedUserForReset}
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      <DeactivateUserModal
        user={selectedUserForDeactivate}
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirmDeactivate={handleConfirmDeactivate}
      />

      <ActivityDetailDrawer
        activity={selectedActivityForDetail}
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />
    </div>
  );
};
