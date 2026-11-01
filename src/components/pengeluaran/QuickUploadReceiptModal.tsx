import React, { useState } from 'react';
import {
  X,
  Upload,
  Paperclip,
  CheckCircle2,
  FileText,
  Trash2,
} from 'lucide-react';
import { ExpenseItem, ExpenseAttachment } from '../../types';

interface QuickUploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
  onSaveReceipts: (expenseId: string, newAttachments: ExpenseAttachment[]) => void;
}

export const QuickUploadReceiptModal: React.FC<QuickUploadReceiptModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSaveReceipts,
}) => {
  const [newFiles, setNewFiles] = useState<ExpenseAttachment[]>([]);

  if (!isOpen || !expense) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt: ExpenseAttachment = {
        id: `att-quick-${Date.now()}`,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'image',
        uploadDate: 'Baru saja',
      };
      setNewFiles((prev) => [...prev, newAtt]);
    }
  };

  const handleRemove = (id: string) => {
    setNewFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    if (newFiles.length === 0) {
      alert('Silakan pilih minimal 1 berkas bukti nota/struk.');
      return;
    }
    onSaveReceipts(expense.id, newFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="modal-quick-upload-receipt"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 text-xs"
      >
        <div className="p-5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center border border-emerald-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Upload Bukti Transaksi
              </h3>
              <p className="text-slate-600 font-mono text-[11px]">
                {expense.transactionNo} • {expense.kategori}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-emerald-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">{expense.keterangan}</div>
            <div className="text-slate-500 font-mono">
              Nominal: Rp {expense.nominal.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Upload Drop Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-[#064E3B] bg-slate-50/50 rounded-xl p-5 text-center transition-colors">
            <input
              id="quick-receipt-file-input"
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <label
              htmlFor="quick-receipt-file-input"
              className="cursor-pointer block space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto border border-emerald-200">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Pilih Berkas Nota / Kwitansi
                </span>
                <span className="text-[11px] text-slate-400">
                  Format JPG, PNG, PDF (Maks. 10 MB)
                </span>
              </div>
            </label>
          </div>

          {/* New Files List */}
          {newFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Berkas yang akan diunggah ({newFiles.length})
              </span>
              {newFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span className="font-bold text-slate-800 truncate block">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(file.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Bukti</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
