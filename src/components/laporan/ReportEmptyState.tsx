import React from 'react';
import { FileQuestion, RotateCcw } from 'lucide-react';

interface ReportEmptyStateProps {
  title?: string;
  description?: string;
  onResetFilter?: () => void;
}

export const ReportEmptyState: React.FC<ReportEmptyStateProps> = ({
  title = 'Belum Ada Data Laporan',
  description = 'Tidak ditemukan data keuangan untuk periode yang dipilih.',
  onResetFilter,
}) => {
  return (
    <div
      id="report-empty-state"
      className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[320px]"
    >
      <div className="w-16 h-16 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-4">
        <FileQuestion className="w-8 h-8 text-[#064E3B]" />
      </div>
      <h3 className="text-base font-bold text-[#1E293B] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">{description}</p>
      {onResetFilter && (
        <button
          id="btn-empty-state-reset"
          onClick={onResetFilter}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold rounded-lg hover:bg-[#053D2E] transition shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Ubah Periode
        </button>
      )}
    </div>
  );
};
