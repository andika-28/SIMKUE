import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Plus,
  ArrowLeftRight,
  FileCheck2,
  TrendingUp,
  RefreshCw,
  Clock,
  ShieldCheck,
  Building,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Eye,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { BankBalanceHero } from './BankBalanceHero';
import { BankAccountCards } from './BankAccountCards';
import { AccountPerformanceSummary } from './AccountPerformanceSummary';
import { AccountListTable } from './AccountListTable';
import { BankReconciliationSection } from './BankReconciliationSection';
import { BankAnalyticsSection } from './BankAnalyticsSection';
import { AccountDetailDrawer } from './AccountDetailDrawer';
import { TransferBetweenAccountsModal } from './TransferBetweenAccountsModal';
import { BalanceAdjustmentModal } from './BalanceAdjustmentModal';
import { AddBankAccountModal } from './AddBankAccountModal';
import { ReconciliationMismatchModal } from './ReconciliationMismatchModal';
import { BankAuditLogModal } from './BankAuditLogModal';

import {
  initialBankAccounts,
  initialBankMutations,
  initialBankReconciliations,
  initialBankCashFlow,
  initialBankBalanceHistory,
  initialBankAdjustments,
} from '../../data/bankAccountData';

import {
  BankAccountItem,
  BankMutationItem,
  BankReconciliationItem,
  BankAdjustmentRecord,
  BankManagementRole,
} from '../../types';

export const RekeningBankView: React.FC = () => {
  // Master Data States
  const [accounts, setAccounts] = useState<BankAccountItem[]>(initialBankAccounts);
  const [mutations, setMutations] = useState<BankMutationItem[]>(initialBankMutations);
  const [reconciliations, setReconciliations] = useState<BankReconciliationItem[]>(
    initialBankReconciliations
  );
  const [adjustments, setAdjustments] = useState<BankAdjustmentRecord[]>(initialBankAdjustments);

  // Active Role state (Bendahara / Admin)
  const [currentRole, setCurrentRole] = useState<BankManagementRole>('Bendahara');

  // Modal / Drawer States
  const [selectedAccountForDetail, setSelectedAccountForDetail] = useState<BankAccountItem | null>(
    null
  );
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferDefaultSourceId, setTransferDefaultSourceId] = useState<string | undefined>(
    undefined
  );

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentDefaultAccountId, setAdjustmentDefaultAccountId] = useState<string | undefined>(
    undefined
  );
  const [adjustmentDefaultAmount, setAdjustmentDefaultAmount] = useState<number | undefined>(
    undefined
  );
  const [adjustmentDefaultReason, setAdjustmentDefaultReason] = useState<string | undefined>(
    undefined
  );

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccountItem | null>(null);

  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const [activeReconMismatch, setActiveReconMismatch] = useState<BankReconciliationItem | null>(
    null
  );

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Calculated Metrics
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + (curr.status === 'AKTIF' ? curr.saldo : 0), 0);
  }, [accounts]);

  const totalIncomeMonth = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.totalMasukBulanIni, 0);
  }, [accounts]);

  const totalExpenseMonth = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.totalKeluarBulanIni, 0);
  }, [accounts]);

  const netSurplusMonth = totalIncomeMonth - totalExpenseMonth;

  // Highest balance account
  const highestAccount = useMemo(() => {
    if (accounts.length === 0) return { name: '-', amount: 0 };
    const sorted = [...accounts].sort((a, b) => b.saldo - a.saldo);
    return { name: sorted[0].accountName, amount: sorted[0].saldo };
  }, [accounts]);

  // Handler for Internal Bank Transfer
  const handleConfirmTransfer = (data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    date: string;
    notes: string;
  }) => {
    const fromAcc = accounts.find((a) => a.id === data.fromAccountId);
    const toAcc = accounts.find((a) => a.id === data.toAccountId);

    if (!fromAcc || !toAcc) return;

    const newFromBalance = fromAcc.saldo - data.amount;
    const newToBalance = toAcc.saldo + data.amount;

    // Update Accounts state
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === data.fromAccountId) {
          return {
            ...acc,
            saldo: newFromBalance,
            totalKeluarBulanIni: acc.totalKeluarBulanIni + data.amount,
            lastTransactionDesc: `Transfer ke ${toAcc.accountName}`,
            lastTransactionAmount: data.amount,
            lastTransactionType: 'KELUAR',
            lastTransactionTime: 'Baru saja',
          };
        }
        if (acc.id === data.toAccountId) {
          return {
            ...acc,
            saldo: newToBalance,
            totalMasukBulanIni: acc.totalMasukBulanIni + data.amount,
            lastTransactionDesc: `Transfer dari ${fromAcc.accountName}`,
            lastTransactionAmount: data.amount,
            lastTransactionType: 'MASUK',
            lastTransactionTime: 'Baru saja',
          };
        }
        return acc;
      })
    );

    // Create 2 mutation records (Debit from source, Credit to target)
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newMutations: BankMutationItem[] = [
      {
        id: `mut-trf-out-${Date.now()}`,
        bankAccountId: fromAcc.id,
        bankAccountName: fromAcc.accountName,
        transactionNo: `TRF-OUT-${Math.floor(1000 + Math.random() * 9000)}`,
        date: '01 Sep 2026',
        time: timestamp,
        type: 'TRANSFER',
        amount: data.amount,
        balanceAfter: newFromBalance,
        description: `Transfer keluar ke ${toAcc.accountName}`,
        category: 'Transfer Antar Rekening',
        source: 'TRANSFER_ANTAR_REKENING',
        sourceLabel: 'Transfer Internal',
        status: 'TERCATAT',
        notes: data.notes,
      },
      {
        id: `mut-trf-in-${Date.now()}`,
        bankAccountId: toAcc.id,
        bankAccountName: toAcc.accountName,
        transactionNo: `TRF-IN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: '01 Sep 2026',
        time: timestamp,
        type: 'MASUK',
        amount: data.amount,
        balanceAfter: newToBalance,
        description: `Transfer masuk dari ${fromAcc.accountName}`,
        category: 'Transfer Antar Rekening',
        source: 'TRANSFER_ANTAR_REKENING',
        sourceLabel: 'Transfer Internal',
        status: 'TERCATAT',
        notes: data.notes,
      },
    ];

    setMutations((prev) => [...newMutations, ...prev]);
    showToast(`Transfer dana Rp ${data.amount.toLocaleString('id-ID')} berhasil dicatat.`);
  };

  // Handler for Balance Adjustment
  const handleSubmitAdjustment = (data: {
    accountId: string;
    type: 'PENAMBAHAN' | 'PENGURANGAN';
    amount: number;
    reason: string;
    attachmentName: string;
    date: string;
  }) => {
    const targetAcc = accounts.find((a) => a.id === data.accountId);
    if (!targetAcc) return;

    const oldBal = targetAcc.saldo;
    const newBal = data.type === 'PENAMBAHAN' ? oldBal + data.amount : oldBal - data.amount;

    // Update account
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === data.accountId) {
          return {
            ...a,
            saldo: newBal,
            lastTransactionDesc: `Penyesuaian: ${data.reason.slice(0, 30)}...`,
            lastTransactionAmount: data.amount,
            lastTransactionType: data.type === 'PENAMBAHAN' ? 'MASUK' : 'KELUAR',
            lastTransactionTime: 'Baru saja',
          };
        }
        return a;
      })
    );

    // Add Mutation
    const newMutation: BankMutationItem = {
      id: `mut-adj-${Date.now()}`,
      bankAccountId: targetAcc.id,
      bankAccountName: targetAcc.accountName,
      transactionNo: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '01 Sep 2026',
      time: '14:40 WIB',
      type: data.type === 'PENAMBAHAN' ? 'MASUK' : 'KELUAR',
      amount: data.amount,
      balanceAfter: newBal,
      description: `Penyesuaian Saldo: ${data.reason}`,
      category: 'Penyesuaian Saldo',
      source: 'PENYESUAIAN_SALDO',
      sourceLabel: 'Jurnal Koreksi',
      status: 'TERCATAT',
      notes: `Lampiran: ${data.attachmentName}`,
    };
    setMutations((prev) => [newMutation, ...prev]);

    // Record Immutable Audit Log
    const newAuditRecord: BankAdjustmentRecord = {
      id: `AUDIT-${Date.now()}`,
      bankAccountId: targetAcc.id,
      bankAccountName: targetAcc.accountName,
      type: data.type,
      previousBalance: oldBal,
      amount: data.amount,
      newBalance: newBal,
      reason: data.reason,
      attachment: data.attachmentName,
      createdBy: `${currentRole} - SIMKEU`,
      createdDate: '01 Sep 2026, 14:40 WIB',
    };
    setAdjustments((prev) => [newAuditRecord, ...prev]);

    // Update reconciliation difference if matched
    setReconciliations((prev) =>
      prev.map((r) => {
        if (r.bankAccountId === targetAcc.id) {
          const newDiff = Math.abs(newBal - r.bankStatementBalance);
          return {
            ...r,
            systemBalance: newBal,
            difference: newDiff,
            status: newDiff === 0 ? 'SESUAI' : 'PERLU_REKONSILIASI',
          };
        }
        return r;
      })
    );

    showToast('Jurnal penyesuaian saldo berhasil dibukukan.');
  };

  // Save new / edited account
  const handleSaveAccount = (accountData: Partial<BankAccountItem>) => {
    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === editingAccount.id ? { ...a, ...accountData } : a))
      );
      showToast(`Rekening ${accountData.accountName || ''} berhasil diperbarui.`);
      setEditingAccount(null);
    } else {
      const newAcc: BankAccountItem = {
        id: `acc-${Date.now()}`,
        bankName: accountData.bankName || 'BNI',
        accountName: accountData.accountName || 'Rekening Baru',
        accountNumber: accountData.accountNumber || '0000000000',
        accountNumberMasked: accountData.accountNumberMasked || '**** **** **** 0000',
        atasNama: accountData.atasNama || 'Yayasan PM. Raudhatussalam Mahato',
        accountTypeLabel: accountData.accountTypeLabel || 'Rekening Operasional Pesantren',
        saldo: accountData.saldo || 0,
        saldoAwal: accountData.saldoAwal || 0,
        totalMasukBulanIni: 0,
        totalKeluarBulanIni: 0,
        status: 'AKTIF',
        minBalanceThreshold: accountData.minBalanceThreshold || 50000000,
        lastTransactionDesc: 'Pembukaan Rekening Baru',
        lastTransactionAmount: accountData.saldo || 0,
        lastTransactionType: 'MASUK',
        lastTransactionTime: 'Hari ini',
        lastUpdated: '01 Sep 2026',
        bankStatementBalance: accountData.saldo || 0,
        isReconciled: true,
        colorTheme: 'emerald',
      };
      setAccounts((prev) => [...prev, newAcc]);
      showToast(`Rekening baru ${newAcc.accountName} berhasil ditambahkan.`);
    }
  };

  // Resolve reconciliation item
  const handleResolveReconItem = (reconId: string, itemId: string) => {
    setReconciliations((prev) =>
      prev.map((r) => {
        if (r.id === reconId) {
          const updatedItems = r.unreconciledItems.filter((item) => item.id !== itemId);
          const newDiff = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
          return {
            ...r,
            unreconciledItems: updatedItems,
            difference: newDiff,
            status: updatedItems.length === 0 ? 'SESUAI' : 'PERLU_REKONSILIASI',
          };
        }
        return r;
      })
    );
    showToast('Transaksi rekonsiliasi berhasil diselesaikan.');
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-400/30 flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100/80 text-[#064E3B]">
              <Landmark className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Rekening Bank
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Pusat monitoring, mutasi transaksi, dan rekonsiliasi perbankan SIMKEU PM. RAUDHATUSSALAM MAHATO
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Badge Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Akses: {currentRole}</span>
          </div>

          {/* Audit Log Button */}
          <button
            id="btn-view-audit-logs"
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Log Audit Saldo
          </button>
        </div>
      </div>

      {/* 1. HERO CARD: Total Saldo Bank */}
      <BankBalanceHero
        totalBalance={totalBalance}
        totalIncomeMonth={totalIncomeMonth}
        totalExpenseMonth={totalExpenseMonth}
        netSurplusMonth={netSurplusMonth}
        lastUpdated="Hari ini, 14:35 WIB"
        activeAccountsCount={accounts.filter((a) => a.status === 'AKTIF').length}
        onOpenTransferModal={() => {
          setTransferDefaultSourceId(undefined);
          setIsTransferModalOpen(true);
        }}
        onOpenAdjustmentModal={() => {
          setAdjustmentDefaultAccountId(undefined);
          setIsAdjustmentModalOpen(true);
        }}
        onOpenAddAccountModal={() => {
          setEditingAccount(null);
          setIsAddAccountModalOpen(true);
        }}
        onScrollToReconciliation={() => {
          const el = document.getElementById('bank-reconciliation-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. TWO BANK ACCOUNT CARDS (BNI Operasional & BNI Utama) */}
      <BankAccountCards
        accounts={accounts}
        totalBalance={totalBalance}
        currentRole={currentRole}
        onSelectAccountDetail={(acc) => setSelectedAccountForDetail(acc)}
        onSelectAccountMutation={(acc) => setSelectedAccountForDetail(acc)}
        onOpenTransferModal={(sourceId) => {
          setTransferDefaultSourceId(sourceId);
          setIsTransferModalOpen(true);
        }}
      />

      {/* 3. PERFORMANCE SUMMARY CARDS */}
      <AccountPerformanceSummary
        highestBalanceAccountName={highestAccount.name}
        highestBalanceAmount={highestAccount.amount}
        incomeToday={18750000}
        expenseToday={8450000}
        totalTransactionsToday={24}
      />

      {/* 4. DAFTAR REKENING TABLE */}
      <AccountListTable
        accounts={accounts}
        currentRole={currentRole}
        onOpenAddModal={() => {
          setEditingAccount(null);
          setIsAddAccountModalOpen(true);
        }}
        onOpenTransferModal={(sourceId) => {
          setTransferDefaultSourceId(sourceId);
          setIsTransferModalOpen(true);
        }}
        onOpenAdjustmentModal={(accId) => {
          setAdjustmentDefaultAccountId(accId);
          setIsAdjustmentModalOpen(true);
        }}
        onSelectAccountDetail={(acc) => setSelectedAccountForDetail(acc)}
        onSelectAccountMutation={(acc) => setSelectedAccountForDetail(acc)}
        onEditAccount={(acc) => {
          setEditingAccount(acc);
          setIsAddAccountModalOpen(true);
        }}
      />

      {/* 5. REKONSILIASI REKENING SECTION */}
      <BankReconciliationSection
        reconciliations={reconciliations}
        onOpenResolveMismatch={(recon) => {
          setActiveReconMismatch(recon);
          setIsMismatchModalOpen(true);
        }}
        onOpenAdjustmentModal={(accId, amount, reason) => {
          setAdjustmentDefaultAccountId(accId);
          setAdjustmentDefaultAmount(amount);
          setAdjustmentDefaultReason(reason);
          setIsAdjustmentModalOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* 6. BANK ANALYTICS & TIMELINE SECTION */}
      <BankAnalyticsSection
        cashFlowHistory={initialBankCashFlow}
        accounts={accounts}
        recentActivities={mutations}
        incomeToday={18750000}
        expenseToday={8450000}
      />

      {/* MODALS & DRAWERS */}
      {/* Account Detail Drawer / Modal */}
      <AccountDetailDrawer
        account={selectedAccountForDetail}
        allMutations={mutations}
        trendHistory={initialBankBalanceHistory}
        isOpen={!!selectedAccountForDetail}
        onClose={() => setSelectedAccountForDetail(null)}
        onOpenTransferModal={(sourceId) => {
          setTransferDefaultSourceId(sourceId);
          setIsTransferModalOpen(true);
        }}
        onOpenAdjustmentModal={(accId) => {
          setAdjustmentDefaultAccountId(accId);
          setIsAdjustmentModalOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* Transfer Between Accounts Modal */}
      <TransferBetweenAccountsModal
        isOpen={isTransferModalOpen}
        accounts={accounts}
        defaultSourceAccountId={transferDefaultSourceId}
        onClose={() => setIsTransferModalOpen(false)}
        onConfirmTransfer={handleConfirmTransfer}
      />

      {/* Balance Adjustment Modal */}
      <BalanceAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        accounts={accounts}
        defaultAccountId={adjustmentDefaultAccountId}
        defaultAmount={adjustmentDefaultAmount}
        defaultReason={adjustmentDefaultReason}
        currentRole={currentRole}
        onClose={() => {
          setIsAdjustmentModalOpen(false);
          setAdjustmentDefaultAmount(undefined);
          setAdjustmentDefaultReason(undefined);
        }}
        onSubmitAdjustment={handleSubmitAdjustment}
      />

      {/* Add / Edit Bank Account Modal */}
      <AddBankAccountModal
        isOpen={isAddAccountModalOpen}
        editAccount={editingAccount}
        onClose={() => {
          setIsAddAccountModalOpen(false);
          setEditingAccount(null);
        }}
        onSaveAccount={handleSaveAccount}
      />

      {/* Reconciliation Mismatch Modal */}
      <ReconciliationMismatchModal
        recon={activeReconMismatch}
        isOpen={isMismatchModalOpen}
        onClose={() => {
          setIsMismatchModalOpen(false);
          setActiveReconMismatch(null);
        }}
        onResolveItem={handleResolveReconItem}
        onOpenAdjustmentModal={(accId, amount, reason) => {
          setAdjustmentDefaultAccountId(accId);
          setAdjustmentDefaultAmount(amount);
          setAdjustmentDefaultReason(reason);
          setIsAdjustmentModalOpen(true);
        }}
      />

      {/* Audit Log Modal */}
      <BankAuditLogModal
        isOpen={isAuditModalOpen}
        adjustments={adjustments}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};
