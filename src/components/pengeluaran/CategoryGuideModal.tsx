import React from 'react';
import {
  X,
  Tag,
  CheckCircle2,
  BookOpen,
  Utensils,
  GraduationCap,
  Users,
  Zap,
  Droplet,
  Wifi,
  FileText,
  Hammer,
  Sparkles,
  Truck,
  HeartPulse,
  PackageCheck,
  HelpCircle,
} from 'lucide-react';
import { initialExpenseCategories } from '../../data/expenseData';

interface CategoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (catName: string) => void;
}

export const CategoryGuideModal: React.FC<CategoryGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'CAT-01':
        return <GraduationCap className="w-4 h-4 text-teal-700" />;
      case 'CAT-02':
        return <Users className="w-4 h-4 text-cyan-700" />;
      case 'CAT-03':
        return <Utensils className="w-4 h-4 text-emerald-700" />;
      case 'CAT-04':
        return <Zap className="w-4 h-4 text-amber-700" />;
      case 'CAT-05':
        return <Droplet className="w-4 h-4 text-sky-700" />;
      case 'CAT-06':
        return <Wifi className="w-4 h-4 text-indigo-700" />;
      case 'CAT-07':
        return <FileText className="w-4 h-4 text-slate-700" />;
      case 'CAT-08':
        return <Hammer className="w-4 h-4 text-orange-700" />;
      case 'CAT-09':
        return <Sparkles className="w-4 h-4 text-blue-700" />;
      case 'CAT-10':
        return <Truck className="w-4 h-4 text-lime-700" />;
      case 'CAT-11':
        return <HeartPulse className="w-4 h-4 text-rose-700" />;
      case 'CAT-12':
        return <PackageCheck className="w-4 h-4 text-purple-700" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="modal-category-guide"
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 text-xs flex flex-col max-h-[85vh]"
      >
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                13 Kategori Pengeluaran Pesantren
              </h3>
              <p className="text-slate-500">
                Pedoman alokasi dan klasifikasi akun pos belanja SIMKEU Raudhatussalam Mahato.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {initialExpenseCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.name);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer group flex items-start gap-3 bg-white"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat.code)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-[#064E3B]">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {cat.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#064E3B] text-white font-bold rounded-xl text-xs hover:bg-[#047857] cursor-pointer"
          >
            Tutup Pedoman
          </button>
        </div>
      </div>
    </div>
  );
};
